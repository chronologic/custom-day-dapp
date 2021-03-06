import React from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip'
import Router from 'next/router';

import { PROPERTIES as ALL_PROPERTIES } from '../../lib/consts';
import {showError} from '../../lib/alerts';
import web3Config from '../../lib/web3Utils';
import AbstractStep from '../AbstractStep';
import StepLayout from '../StepLayout';

import {Boxloader} from '../../lib/loader';

@inject('web3Service')
@inject('store')
@observer
export default class Step4 extends AbstractStep {
  constructor(props) {
    super('DEBT_PUBLISH', 'debt', props);
    this.runDeploy = this.runDeploy.bind(this);
  }

  getValidations() {
    return this._validations;
  }

  @observable
  _validations = {
    tokenName: true,
    symbol: true,
    interestRate: true,
    interestCycle: true,
    loanTerm:true,
    dayLength:true,
    debtOwner:true,
    initialAmount: true,
    exchangeRate: true,
    decimalUnits:true,
  };

  @observable
  _state = {
    notReady: true,
    deploying: false,
    deployReady:false,
    contractInstance:{},
    deploymentData:{}
  }

  async componentDidMount(){
    super.componentDidMount();
    await this.checkDeployable();
  }

  findHCF(x, y) {
     // If the input numbers are less than 1 return an error message.
     if (x < 1 || y < 1) {
        console.log("Please enter values greater than zero.");
        return;
     }
     // If the input numbers are not integers return an error message.
     if (x != Math.round(x) || y != Math.round(y)) {
        console.log("Please enter whole numbers.");
        return;
     }
     // Now apply Euclid's algorithm to the two numbers.
     while (Math.max(x, y) % Math.min(x, y) != 0) {
        if (x > y) {
           x %= y;
        }
        else {
           y %= x;
        }
     }
     // When the while loop finishes the minimum of x and y is the HCF.
     return Math.min(x, y);
  }

  goNext = () => {
    const { props: { store } } = this;
    let that = this;
    const CONTRACT_PROPERTIES = ['transactionHash','newContract']
    const query = CONTRACT_PROPERTIES.reduce((result, name) => {
      result[name] = that._state[name];
      return result;
    }, {});

    Router.push({
      pathname: this.activeStep.nextUrl,
      query,
    });
  };

  renderProperty(propertyData, otherProps = {}) {
    const { props: { store } } = this;
    const {
      name,
      title,
    } = propertyData;
    return (
      <div className={otherProps.side}>
        <span className="values">{`${title}: ${store[name]}`}</span>
      </div>
    );
  }

  async runDeploy(eventInst){
    var target = eventInst.target
    const {web3Service} = this.props;
    const {web3} = web3Service;
    if(this.web3Disabled(web3Service) )
      return;
    target.disabled = true;
    this.setState( Object.assign(this._state,{deploying:true}) );
    let newContract;
    try{
      let contData = this.fetchData();
      const dayLength = this.findHCF(contData.interestCycle,contData.loanTerm);

      contData.interestCycle = contData.interestCycle/dayLength;
      contData.loanTerm = contData.loanTerm/dayLength;
      contData.dayLength = dayLength;

      const transaction = await web3Service.deploy( contData );
      newContract = await this.contractDeployed(transaction);
      this.setState( Object.assign(this._state,{deploying:false}) );
    }
    catch(e){
      target.disabled = false;
      console.error(e);
      showError('Transaction Failed.');
    }

    this.setState( Object.assign(this._state,{deploying:false,notReady:false}) );

    if(newContract && web3.isAddress(newContract) ){
      this.setState( Object.assign(this._state,{newContract:newContract}) );
      this.goNext();
    }
    else{
      const error = await showError('There was problem deploying the contract. Try again?');

      if(error)
      target.disabled = false;
    }
  }

  async contractDeployed( transaction ){
    const {web3Service,store} = this.props;
    this.setState( Object.assign(this._state,{transactionHash:transaction,notReady:true}) );
    const mined = await this.awaitMined(transaction);
    this.setState( Object.assign(this._state,{transactionReceipt:mined}) );
    const confirmations = await this.checkConfirmations(transaction);
    this.setState( Object.assign(this._state,{notReady:false}) );
    const contract = await web3Service.fetchNewChild(transaction);
    return contract;
  }

  async awaitMined (transaction){
     const {web3Service} = this.props;
     const mined = await web3Service.trackTransaction(transaction);
     return mined;
  }

  async checkConfirmations (transaction){
    const {web3Service} = this.props;
    const confirmations = await web3Service.fetchConfirmations(transaction);
    console.log(confirmations)
    if(confirmations < 1 )
      return await this.checkConfirmations(transaction);
    else{
      this.setState( Object.assign(this._state,{loadingData:true}) );
      return confirmations;
    }
  }

  fetchData(){
    const { props: { store }, activeStep: { propertyKeys } } = this;
    var data = {};
    propertyKeys.map(function(field){
      data[field] = store[field]
    })
    return data;
  }

  render() {

    const {web3Service} = this.props;
    const EXPLORER = web3Config[this.activeApp][web3Service.network].EXPLORER;

    return (
      <StepLayout
        activeApp = {this.activeApp}
        activeStepKey={this.activeStepKey}
        onNext={this.runDeploy}
        nextTitle="Deploy"
        web3Disabled = { !this._state.deployReady }
      >
        {!this._state.deploying &&
          <div>
            <div className="input-block-container">
              {this.renderProperty(this.properties.tokenName, { side: 'left' })}
              {this.renderProperty(this.properties.symbol, { side: 'right' })}
            </div>
            <div className="input-block-container">
              {this.renderProperty(this.properties.interestRate, { side: 'left' })}
              {this.renderProperty(this.properties.interestCycle, { side: 'right' })}
            </div>
            <div className="input-block-container">
              {this.renderProperty(this.properties.loanTerm, { side: 'left' })}
              {this.renderProperty(this.properties.exchangeRate, { side: 'right' })}
            </div>
            <div className="input-block-container">
              {this.renderProperty(this.properties.debtOwner, { side: 'left' })}
              {this.renderProperty(this.properties.initialAmount, { side: 'right' })}
            </div>
          </div>
        }
        {this._state.deploying &&
         <div className="input-block-container">
          <Boxloader {...{color:'#123abc',loading: true, size:13,msg:!this._state.transactionHash?'Deploying...':'Awaiting Mining ...'}} />
         </div>
        }
        {this._state.deploying && !this._state.notReady &&
          <div className="input-block-container center text-center">
            <p className='loading_msg' >Successfully deployed ...</p>
          </div>
        }
        {this._state.deploying && this._state.transactionHash &&
          <div className="input-block-container value center text-center">
            <label className="label">Transaction Hash : </label>
            <a target="_blank" href={EXPLORER+'/tx/'+this._state.transactionHash}>{this._state.transactionHash}</a>
          </div>
        }
      </StepLayout>
    );
  }
}
