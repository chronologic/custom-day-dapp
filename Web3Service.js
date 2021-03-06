import Web3 from 'web3/index';
import ethers from 'ethers';
import Bb from 'bluebird';
import { action, observable, runInAction } from 'mobx';

import dayTokenABI from './abi/dayTokenABI';
import deployerABI from './abi/deployerABI';
import dayFaucetABI from './abi/dayFaucetABI';
import debtTokenDeployerABI from './abi/debtTokenDeployerABI';

import web3Config from './lib/web3Utils.js'
import debtTokenABI from "./abi/debtTokenABI";

let instance = null;
let TOKEN_CONTRACT_ADDRESS,
    DEPLOYER_ADDRESS,
    //  DEBT_TOKEN_DEPLOYER_ADDRESS,
    FAUCET_ADDRESS,
    MIN_FEE;

export default class Web3Service {
    web3 = null;
    tokenInstance = null;
    deployerInstance = null;
    @observable initialized = false;
    @observable connectedToMetaMask = null;
    @observable accounts = null;
    @observable netId = null;
    @observable network = 'Rinkeby';
    deployerAbis = {
        debt: debtTokenDeployerABI,
        daytoken: deployerABI
    }
    childTopics = () => {
        const {web3} = this;
        return {
            debt: {
                topic: web3.sha3("DebtTokenCreated(address,address,uint256)"),
                params: ['address', 'address', 'uint256'],
                eventFxn: 'DebtTokenCreated',
                eventContractPosition: 1,
                eventContractTitle: '_debtTokenAddress',
            },
            daytoken: {
                topic: web3.sha3("LogChildCreated(address,address)"),
                params: ['address', 'address'],
                eventFxn: 'LogChildCreated',
                eventContractPosition: 1,
                eventContractTitle: 'child',
            }
        };
    }

    constructor(props) {
        Object.assign(this, props);
    }

    @action
    async init(which) {

        if (!this.initialized) {
            await this.connect(which);
            this.initialized = true;
            this.activeApp = which;
            return true;
        } else {
            return false;
        }
    }

    @action
    async connect(which) {
        let {web3} = this;
        if (!web3) {
            if (typeof window.ethereum !== 'undefined') {
                this.accounts = await window.ethereum.enable();
                const provider = window['ethereum'] || window.web3.currentProvider;
                web3 = new Web3(provider);
                this.connectedToMetaMask = true;
            } else {
                web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
                this.connectedToMetaMask = false;
            }
            window.web3 = web3;
            this.web3 = web3;
        }
        if (!this.connectedToMetaMask || !this.web3.isConnected())//Do not proceed if not connected to metamask
            return;

        web3.eth.defaultAccount = this.accounts[0];
        console.log('accounts', this.accounts);
        const netId =
            await Bb.fromCallback(callback => web3.version.getNetwork(callback));
        runInAction(() => {
            this.netId = netId;
            let network;
            if (netId == 1)
                this.network = 'Mainnet';
            else if (netId == 3)
                this.network = 'Ropsten'
            else if (netId == 4)
                this.network = 'Rinkeby';
            else
                this.network = 'Private'
        });
        console.log('netId', this.netId, this.network);

        TOKEN_CONTRACT_ADDRESS = web3Config[which][this.network].TOKEN_CONTRACT_ADDRESS;
        DEPLOYER_ADDRESS = web3Config[which][this.network].DEPLOYER_ADDRESS;
        FAUCET_ADDRESS = web3Config[which][this.network].FAUCET_ADDRESS;
        MIN_FEE = web3Config[which][this.network].MIN_FEE;
        //DEBT_TOKEN_DEPLOYER_ADDRESS = web3Config[which][this.network].DEBT_TOKEN_DEPLOYER_ADDRESS;

        const Active_Deployer_ABI = this.deployerAbis[which];

        this.tokenInstance = web3.eth.contract(dayTokenABI).at(TOKEN_CONTRACT_ADDRESS);
        this.deployerInstance = web3.eth.contract(Active_Deployer_ABI).at(DEPLOYER_ADDRESS);
        //this.deployerInstance = await Bb.fromCallback(callback => web3.eth.contract(deployerABI).at(DEPLOYER_ADDRESS
        //,callback) );
        this.faucetInstance = web3.eth.contract(dayFaucetABI).at(FAUCET_ADDRESS);
        //this.debtTokenDeployerInstance = web3.eth.contract(debtTokenDeployerABI).at(DEBT_TOKEN_DEPLOYER_ADDRESS);

    }


    async approveFee() {
        const result = await Bb.fromCallback((callback) => {
            this.tokenInstance.approve(DEPLOYER_ADDRESS, MIN_FEE, callback);
        });
        return result;
    }

    async deploy(contractData) {
        let {web3, deployerInstance} = this;

        let transactionOptions = {
            gasPrice: (await this.fetchGasPrice()).plus(web3.toWei(2, 'gwei')),
        }
        let hash;

        switch (this.activeApp) {
            case 'daytoken':
                hash = await Bb.fromCallback((callback) => {
                    deployerInstance.createCustomDayToken(
                        contractData.tokenName,
                        contractData.symbol,
                        contractData.maxAddresses,
                        contractData.startingId,
                        contractData.totalMintingId,
                        contractData.postDeploymentMaxIds,
                        this.convertMiningPower(contractData.minMintingPower),
                        this.convertMiningPower(contractData.maxMintingPower),
                        contractData.halvingCycle,
                        contractData.minimumBalance,
                        contractData.mintingPeriod,
                        contractData.teamLockPeriod,
                        transactionOptions,
                        callback
                    )
                });
                break;
            case 'debt':
                hash = await Bb.fromCallback((callback) => {
                    deployerInstance.createDebtToken(
                        contractData.tokenName,
                        contractData.symbol,
                        this.convertEtherToWei(contractData.initialAmount),
                        contractData.exchangeRate,
                        contractData.dayLength,
                        contractData.loanTerm,
                        contractData.interestCycle,
                        contractData.interestRate,
                        contractData.debtOwner,
                        transactionOptions,
                        callback
                    )
                });
                break;
        }

        return hash;
    }


    async requestFromFaucet() {
        const tokenBalance = Number( (await Bb.fromCallback(callback => this.faucetInstance.getTokensBalance.call(callback))).valueOf() );
        const waitTime = Number( (await Bb.fromCallback(callback => this.faucetInstance.waitTime.call(callback))).valueOf() );
        const lastRequest = Number( (await Bb.fromCallback(callback => this.faucetInstance.lastRequest.call(this.accounts[0], callback))).valueOf() );
        const now = Math.floor(new Date().getTime() / 1000);

        if (tokenBalance < MIN_FEE)
            return {status: -1}

        if ((now - lastRequest) < waitTime)
            return {status: 0, data: waitTime - (now - lastRequest)}

        const faucetTxn = await Bb.fromCallback(callback => this.faucetInstance.useFaucet(callback));
        return {status: 1, data: faucetTxn};
    }

    async acceptTokenOwnership(contract) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(contract);
        const txn = await Bb.fromCallback(callback => childContract.acceptOwnership(callback));
        return txn;
    }

    async updateInterest(contract) {
        const {web3} = this;
        const childContract = web3.eth.contract(debtTokenABI).at(contract);
        const txn = await Bb.fromCallback(callback => childContract.updateInterest(callback));
        return txn;
    }

    async fundLoan(contract,loanAmount) {
        const {web3} = this;
        const childContract = web3.eth.contract(debtTokenABI).at(contract);
        const txn = await Bb.fromCallback(callback => childContract.fundLoan({value: loanAmount},callback));
        return txn;
    }

    async refundLoan(contract,loanAmount) {
        const {web3} = this;
        const childContract = web3.eth.contract(debtTokenABI).at(contract);
        const txn = await Bb.fromCallback(callback => childContract.refundLoan({value:loanAmount},callback));
        return txn;
    }

    async releaseTokens(contract) {
        const releasetime = Math.round((new Date()).getTime() / 1000);
        const childContract = web3.eth.contract(dayTokenABI).at(contract);
        const released = await Bb.fromCallback(callback => childContract.releaseToken(releasetime, callback));
        return released;
    }

    async allocateTeamTimemints(data) {
        const childContract = web3.eth.contract(dayTokenABI).at(data.contract);
        const allocateTeam = await Bb.fromCallback(callback => childContract.addTeamTimeMints(
            data.receiverAddress,
            data.timemintId,
            data.tokens,
            data.isTest,
            callback
        ));
        return allocateTeam;
    }

    async allocateNormalTimeMints(data) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(data.contract);
        const allocateNormal = await Bb.fromCallback(callback => childContract.allocateNormalTimeMints(
            data.receiverAddress,
            0,
            data.timemintId,
            data.tokens,
            data.weiAmount,
            callback
        ));
        return allocateNormal;
    }

    async postAllocateAuctionTimeMints(data) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(data.contract);
        const postAllocate = await Bb.fromCallback(callback => childContract.postAllocateAuctionTimeMints(
            data.receiverAddress,
            0,
            data.timemintId,
            callback
        ));
        return postAllocate;
    }

    convertMiningPower = (value, reverse) => {
        if (reverse)
            return this.convertEtherToWei(value, true) * 100;
        return this.convertEtherToWei(value)/ 100;
    }

    convertEtherToWei = (value, reverse) => {
        if (reverse)
            return value / 1e+18;
        return value * 1e+18;
    }

    finePrint = value =>{
        if( new RegExp('^\\d+\\.?\\d{8,}.*$').test(value) )
            return Number(value).toFixed(8)
        else
            return value;
    }

    async fetchLoanValue(contract,initial) {
        const {web3} = this;
        initial = typeof initial === 'undefined'?false:initial;
        const childContract = web3.eth.contract(debtTokenABI).at(contract);
        const loanAmount = await Bb.fromCallback(callback => childContract.getLoanValue.call(initial,callback));
        return loanAmount;
    }

    async fetchGasPrice() {
        const {web3} = this;
        const result = await Bb.fromCallback(callback =>
            web3.eth.getGasPrice(callback)
        );
        return result;
    }

    async checkTokenOwnership(contract) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(contract);
        const owner = await Bb.fromCallback(callback => childContract.owner.call(callback));
        const newOwner = await Bb.fromCallback(callback => childContract.newOwner.call(callback));
        if (owner == web3.eth.defaultAccount)
            return owner
        else if (owner != web3.eth.defaultAccount && newOwner == web3.eth.defaultAccount)
            return true;
        else
            return false;
    }

    async checkBalance() {
        const result = await Bb.fromCallback((callback) => {
            this.tokenInstance.balanceOf.call(this.accounts[0], callback);
        });
        return result.valueOf() >= MIN_FEE;
    }

    async checkAllowance() {
        const result = await Bb.fromCallback((callback) => {
            this.tokenInstance.allowance.call(this.accounts[0], DEPLOYER_ADDRESS, callback);
        });
        return result.valueOf() >= MIN_FEE;
    }

    async awaitInitialized(){
        const that = this;
        if(!this.initialized){
            let Promises = new Promise((resolve, reject) => {
                setTimeout(async function () {
                    resolve(await that.awaitInitialized());
                }, 2000);
            })
            return Promises;
        }
        else
            return true;
    }

    async trackTransaction(hash) {
        //let {deployerInstance,trackTransaction} = this;
        let receipt;
        const that = this;

        if (!(receipt = await this.fetchReceipt(hash))) {
            let Promises = new Promise((resolve, reject) => {
                setTimeout(async function () {
                    resolve(await that.trackTransaction(hash));
                }, 2000);
            })
            return Promises;
        }
        else {
            return receipt;
        }
    }

    async fetchReceipt(hash) {
        let {web3} = this;
        let receipt = await Bb.fromCallback(callback =>
            web3.eth.getTransactionReceipt(hash, callback));
        return receipt;
    }

    async fetchConfirmations(transaction) {
        const mined = await this.trackTransaction(transaction);
        const block = await this.fetchBlockNumber();
        const that = this;
        if (!mined.blockNumber) {
            let Promises = new Promise((resolve, reject) => {
                setTimeout(async function () {
                    resolve(await that.fetchConfirmations(transaction));
                }, 2000);
            })
            return Promises;
        }
        else {
            return (block - mined.blockNumber);
        }
    }

    async fetchBlockNumber() {
        const {web3} = this;
        const block = await Bb.fromCallback(callback =>
            web3.eth.getBlockNumber(callback));
        return block;
    }

    async fetchNewChild(hash) {
        const {web3} = this;
        const receipt = await this.fetchReceipt(hash);
        const config = this.childTopics()[this.activeApp];
        const that = this;

        let foundLog;
        if (!receipt.logs || typeof receipt.logs !== 'object' || receipt.logs.length < 1)
            return false;
        receipt.logs.forEach(function (l) {
            if (l.address.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase())
                if (l.topics[0] == config.topic)
                    foundLog = l.data;
        })
        if (!foundLog)
            return false;
        let result = ethers.Interface.decodeParams(config.params, foundLog);
        console.log('New Contract', result[ config.eventContractPosition ] )
        return result[ config.eventContractPosition ];
    }

    async fetchCreationHash(contract) {
        const {web3} = this;
        let foundLog = null,
            DEPLOYER_FIRST_BLOCK = web3Config[this.activeApp][this.network].DEPLOYER_FIRST_BLOCK;
        const filterConfig = {
            //topics: [web3.sha3("LogChildCreated(address,address)")],
            fromBlock: DEPLOYER_FIRST_BLOCK,
            toBlock: 'latest',
        }

        const config = this.childTopics()[this.activeApp];
        const fn = config.eventFxn;

        const created = await Bb.fromCallback(callback => this.deployerInstance[fn]({}, filterConfig).get(callback));
        created.forEach(log => {
            if (log.args[ config.eventContractTitle].toLowerCase() == contract.toLowerCase())
                foundLog = log.transactionHash;
        })
        return foundLog;
    }

    async fetchTeamAllocationHistory(contract, deployedBlock) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(contract);
        const filterConfig = {
            //topics: [web3.sha3("LogChildCreated(address,address)")],
            fromBlock: deployedBlock,
            toBlock: 'latest',
        }
        let allocLogs = await Bb.fromCallback(callback => childContract.TeamAddressAdded({}, filterConfig).get(callback));
        allocLogs = this.parseAllocationLog(allocLogs);
        return allocLogs;
    }

    async fetchNormalAllocationHistory(contract, deployedBlock) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(contract);
        const filterConfig = {
            //topics: [web3.sha3("LogChildCreated(address,address)")],
            fromBlock: deployedBlock,
            toBlock: 'latest',
        }
        let allocLogs = await Bb.fromCallback(callback => childContract.Invested({}, filterConfig).get(callback));
        allocLogs = this.parseAllocationLog(allocLogs);
        return allocLogs;
    }

    async fetchPostICOAllocationHistory(contract, deployedBlock) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(contract);
        const filterConfig = {
            //topics: [web3.sha3("LogChildCreated(address,address)")],
            fromBlock: deployedBlock,
            toBlock: 'latest',
        }
        let allocLogs = await Bb.fromCallback(callback => childContract.PostInvested({}, filterConfig).get(callback));
        allocLogs = this.parseAllocationLog(allocLogs);
        return allocLogs;
    }

    parseAllocationLog = logs => {
        let found = [];
        logs.map(l => {
            for (let m in l.args) {
                if (typeof l.args[m].valueOf !== 'undefined')
                    l.args[m] = l.args[m].valueOf();
                switch (true) {
                    case (m == 'investor' || m == 'teamAddress'):
                        l.args.receiver = l.args[m];
                        delete(l.args[m]);
                        break;
                    case m == 'id':
                        l.args.contributorId = l.args[m];
                        delete(l.args[m]);
                        break;
                }
            }

            found.push(Object.assign(
                {},
                l.args,
                {
                    transactionHash: l.transactionHash,
                    blockNumber: l.blockNumber
                }
            ))
        });
        return found;
    }

    async prepareWatch(hash) {
        const {web3} = this;
        let contract, transaction;
        if (web3.isAddress(hash)) {
            contract = hash;
            transaction = await this.fetchCreationHash(hash);
        }
        else {
            contract = await this.fetchNewChild(hash);
            if (contract)
                transaction = hash;
        }
        return {
            newContract: contract,
            transactionHash: transaction
        };
    }

    async isTokensReleased(contract) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(contract);
        const releaseState = await Bb.fromCallback(callback => childContract.released.call(callback));
        return releaseState;
    }

    async isTokensOwned(contract) {
        const {web3} = this;
        const childContract = web3.eth.contract(dayTokenABI).at(contract);
        const owner = await Bb.fromCallback(callback => childContract.owner.call(callback));
        return owner.toLowerCase() === web3.eth.defaultAccount.toLowerCase();
    }

    async getAllocationHistory(contract) {
        const {web3} = this;
        let fromBlock = (await this.fetchBlockNumber()) - 0x2710; //set default fromBlock to 10000 blocks ago
        const DEPLOYER_FIRST_BLOCK = web3Config[this.activeApp][this.network].DEPLOYER_FIRST_BLOCK;
        fromBlock = fromBlock > DEPLOYER_FIRST_BLOCK ? fromBlock : DEPLOYER_FIRST_BLOCK;
        const watchPrep = await this.prepareWatch(contract);
        if (watchPrep.transactionHash) {
            const receipt = await this.fetchReceipt(watchPrep.transactionHash);
            if (receipt)
                fromBlock = receipt.blockNumber;
        }

        const found = {
            team: await this.fetchTeamAllocationHistory(contract, fromBlock),
            normal: await this.fetchNormalAllocationHistory(contract, fromBlock),
            postico: await this.fetchPostICOAllocationHistory(contract, fromBlock)
        }

        let allocations = [];
        for (let f in found) {
            found[f].forEach(a => allocations.push(Object.assign(a, {type: f})));
        }
        return allocations.sort(function (a, b) {
            return a.blockNumber - b.blockNumber
        });
    }


    async getContractData(contract) {
        const {web3} = this;
        console.log('Contract: ', contract)
        let data;
        switch (this.activeApp) {
            case 'daytoken':
                const childContract = web3.eth.contract(dayTokenABI).at(contract);
                data = {
                    address: contract,
                    tokenName: (await Bb.fromCallback(callback => childContract.name.call(callback))).valueOf(),
                    symbol: (await Bb.fromCallback(callback => childContract.symbol.call(callback))).valueOf(),
                    totalSupply: this.finePrint((await Bb.fromCallback(callback => childContract.totalSupply.call(callback))).valueOf()),
                    decimal: (await Bb.fromCallback(callback => childContract.decimals.call(callback))).valueOf(),
                    mintingPeriod: this.finePrint((await Bb.fromCallback(callback => childContract.DayInSecs.call(callback))).valueOf()),
                    totalDays: (await Bb.fromCallback(callback => childContract.getDayCount.call(callback))).valueOf(),
                    halvingCycle: this.finePrint((await Bb.fromCallback(callback => childContract.halvingCycle.call(callback))).valueOf()),
                    dayTokenActivated: (await Bb.fromCallback(callback => childContract.isDayTokenActivated.call(callback))).valueOf().toString(),
                    maxAddresses: this.finePrint((await Bb.fromCallback(callback => childContract.maxAddresses.call(callback))).valueOf()),
                    firstContributorId: this.finePrint((await Bb.fromCallback(callback => childContract.firstContributorId.call(callback))).valueOf()),
                    firstPostIcoContributorId: this.finePrint((await Bb.fromCallback(callback => childContract.firstPostIcoContributorId.call(callback))).valueOf()),
                    firstTeamContributorId: this.finePrint((await Bb.fromCallback(callback => childContract.firstTeamContributorId.call(callback))).valueOf()),
                    minMintingPower: this.finePrint(this.convertMiningPower((await Bb.fromCallback(callback => childContract.minMintingPower.call(callback))).valueOf(), true)),
                    maxMintingPower: this.finePrint(this.convertMiningPower((await Bb.fromCallback(callback => childContract.maxMintingPower.call(callback))).valueOf(), true)),
                    initialBlockTimestamp: (await Bb.fromCallback(callback => childContract.initialBlockTimestamp.call(callback))).valueOf(),
                    teamLockPeriodInSec: this.finePrint((await Bb.fromCallback(callback => childContract.teamLockPeriodInSec.call(callback))).valueOf()),
                    totalNormalContributorIds: this.finePrint((await Bb.fromCallback(callback => childContract.totalNormalContributorIds.call(callback))).valueOf()),
                    totalNormalContributorIdsAllocated: this.finePrint((await Bb.fromCallback(callback => childContract.totalNormalContributorIdsAllocated.call(callback))).valueOf()),
                    totalTeamContributorIds: this.finePrint((await Bb.fromCallback(callback => childContract.totalTeamContributorIds.call(callback))).valueOf()),
                    totalTeamContributorIdsAllocated: this.finePrint((await Bb.fromCallback(callback => childContract.totalTeamContributorIdsAllocated.call(callback))).valueOf()),
                    totalPostIcoContributorIds: this.finePrint((await Bb.fromCallback(callback => childContract.totalPostIcoContributorIds.call(callback))).valueOf()),
                    totalPostIcoContributorIdsAllocated: this.finePrint((await Bb.fromCallback(callback => childContract.totalPostIcoContributorIdsAllocated.call(callback))).valueOf()),
                    isReleased: (await Bb.fromCallback(callback => childContract.released.call(callback))).valueOf(),
                }
                break;
            case 'debt':
                const debtContract = web3.eth.contract(debtTokenABI).at(contract);
                data = {
                    address: contract,
                    tokenName: (await Bb.fromCallback(callback => debtContract.name.call(callback))).valueOf(),
                    symbol: (await Bb.fromCallback(callback => debtContract.symbol.call(callback))).valueOf(),
                    totalSupply: this.finePrint(this.convertEtherToWei((await Bb.fromCallback(callback => debtContract.totalSupply.call(callback))).valueOf(),true)),
                    dayLength: this.finePrint((await Bb.fromCallback(callback => debtContract.dayLength.call(callback))).valueOf()),
                    loanTerm: this.finePrint((await Bb.fromCallback(callback => debtContract.loanTerm.call(callback))).valueOf()),
                    exchangeRate: this.finePrint((await Bb.fromCallback(callback => debtContract.exchangeRate.call(callback))).valueOf()),
                    interestCycle: this.finePrint((await Bb.fromCallback(callback => debtContract.interestCycleLength.call(callback))).valueOf()),
                    interestRate: this.finePrint((await Bb.fromCallback(callback => debtContract.interestRatePerCycle.call(callback))).valueOf()),
                    isInterestStatusUpdated: this.finePrint((await Bb.fromCallback(callback => debtContract.isInterestStatusUpdated.call(callback))).valueOf()),
                    initialLoanAmount: this.finePrint(this.convertEtherToWei((await Bb.fromCallback(callback => debtContract.getLoanValue.call(true,callback))).valueOf(), true)),
                    loanAmount: this.finePrint(this.convertEtherToWei((await Bb.fromCallback(callback => debtContract.getLoanValue.call(false,callback))).valueOf(), true)),
                    loanActivation: (await Bb.fromCallback(callback => debtContract.loanActivation.call(callback))).valueOf(),
                    isLoanFunded: (await Bb.fromCallback(callback => debtContract.isLoanFunded.call(callback))).valueOf(),
                    isTermOver: (await Bb.fromCallback(callback => debtContract.isTermOver.call(callback))).valueOf(),
                    lender: (await Bb.fromCallback(callback => debtContract.lender.call(callback))).valueOf(),
                    borrower: (await Bb.fromCallback(callback => debtContract.borrower.call(callback))).valueOf(),
                }
                break;

        }
        return data;
    }

    async getDeploymentData(transaction) {
        let {web3} = this;

        const data = {
            creationCode: (await Bb.fromCallback(callback => web3.eth.getTransaction(transaction, callback))).input,
            abi: JSON.stringify(this.deployerAbis[this.activeApp]),
        }
        return data;
    }

    async isLoanRefunded(contract) {
        let {web3} = this;
        const block = await Bb.fromCallback(callback => web3.eth.getBlock("latest",callback) );
        const debtToken = await web3.eth.contract(debtTokenABI).at(contract);
        const loanActivation = (await Bb.fromCallback(callback =>  debtToken.loanActivation.call(callback) )).valueOf();
        const isLoanFunded = (await Bb.fromCallback(callback =>  debtToken.isLoanFunded.call(callback) )).valueOf();
        return Number(loanActivation) > 0 && Number(block.timestamp) > loanActivation && !isLoanFunded;
    }
}

export function initWeb3Service(isServer, source) {
    if (isServer) {
        return new Web3Service(source);
    } else {
        if (instance === null) {
            instance = new Web3Service(source);
        }
        return instance;
    }
}