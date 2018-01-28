
          window.__NEXT_REGISTER_PAGE('/debt', function() {
            var comp = module.exports=webpackJsonp([10],{164:function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(9),u=a(n),s=r(10),o=a(s),i=r(6),l=a(i),c=r(4),f=a(c),d=r(5),p=a(d),m=r(7),h=a(m),b=r(8),v=a(b),_=r(0),N=(a(_),r(22)),k=a(N),w=(r(16),r(15),r(27),r(34)),E=r(69),y=a(E),x=function(e){function t(e,r){var a=this;(0,f.default)(this,t);var n=(0,h.default)(this,(t.__proto__||(0,l.default)(t)).call(this,r));return n.onStart=function(){var e=(0,o.default)(u.default.mark(function e(t){var r,s,o;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!n.web3Disabled()){e.next=2;break}return e.abrupt("return");case 2:return r=t.target,r.disabled=!0,s=n.props.web3Service,e.next=7,s.checkBalance();case 7:if(e.sent){e.next=20;break}return e.next=10,(0,w.showInsufficientBalalnce)(n.state.MIN_FEE/1e18);case 10:if(o=e.sent,n.setState({needsFaucet:!0}),n.hasFaucet(),"preview"!=o){e.next=17;break}return e.abrupt("return",n.start());case 17:return e.abrupt("return",r.disabled=!1);case 18:e.next=37;break;case 20:return e.next=22,s.checkAllowance();case 22:if(e.t0=e.sent,e.t0){e.next=32;break}return e.next=26,(0,w.confirmFeeWithdraw)(n.state.MIN_FEE);case 26:if(e.t1=e.sent,!e.t1){e.next=31;break}return e.next=30,n.reserveTokens();case 30:e.t1=e.sent;case 31:e.t0=e.t1;case 32:if(!e.t0){e.next=36;break}n.start(),e.next=37;break;case 36:r.disabled=!1;case 37:case"end":return e.stop()}},e,a)}));return function(t){return e.apply(this,arguments)}}(),n.state={MIN_FEE:null,needsFaucet:!1},n.activeApp=e,n.getTestnetTokens=n.getTestnetTokens.bind(n),n.onWatch=n.onWatch.bind(n),n}return(0,v.default)(t,e),(0,p.default)(t,[{key:"onWatch",value:function(){function e(e){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(t){var r;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.web3Disabled()){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,(0,w.showContractAddressRequest)();case 4:if(r=e.sent){e.next=7;break}return e.abrupt("return");case 7:return e.abrupt("return",this.goWatch(r,t));case 8:case"end":return e.stop()}},e,this)}));return e}()},{key:"goWatch",value:function(){function e(e,r){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(t,r){var a,n,s,o,i;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.web3Disabled()){e.next=2;break}return e.abrupt("return");case 2:return a=this.props.web3Service,n=void 0,s=["transactionHash","newContract"],e.prev=5,e.next=8,a.prepareWatch(t);case 8:n=e.sent,e.next=15;break;case 11:return e.prev=11,e.t0=e.catch(5),console.error(e.t0),e.abrupt("return",(0,w.showError)("Failed!!!. Kindly check your Input and Network connection"));case 15:if(o=void 0,s.forEach(function(e){if(n[e]==t)return o=!0}),o){e.next=19;break}return e.abrupt("return",(0,w.showError)("Unable to retreive contract"));case 19:i=s.reduce(function(e,t){return e[t]=n[t],e},{}),k.default.push({pathname:r,query:i});case 21:case"end":return e.stop()}},e,this,[[5,11]])}));return e}()},{key:"reserveTokens",value:function(){function e(){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(){var t,r;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.web3Service,e.prev=1,e.next=4,t.approveFee();case 4:r=e.sent,(0,w.showInfo)("Token Release Tx Status"," "+r),this.start(),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(1),(0,w.showError)("Could not complete transaction");case 12:case"end":return e.stop()}},e,this,[[1,9]])}));return e}()},{key:"componentDidMount",value:function(){this.getWeb3Fee()}},{key:"getWeb3Fee",value:function(){function e(){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(){var t,r;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=this.props.web3Service,r=this,void 0===t.network||null===t.network){e.next=4;break}return e.abrupt("return",this.setState({MIN_FEE:y.default[this.activeApp][t.network].MIN_FEE}));case 4:setTimeout(function(){return r.getWeb3Fee()},200);case 5:case"end":return e.stop()}},e,this)}));return e}()},{key:"getTestnetTokens",value:function(){function e(){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(){var t,r;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.web3Service,e.prev=1,e.next=4,t.requestFromFaucet();case 4:if(r=e.sent,-1!=r.status){e.next=9;break}return e.abrupt("return",(0,w.showError)("Sorry the Faucet is not funded at the moment"));case 9:if(0!=r.status){e.next=11;break}return e.abrupt("return",(0,w.showError)("You have to wait for another "+(r.data/60).toFixed(2)+" min(s) to request Tokens."));case 11:(0,w.showInfo)("Token Faucet request Tx Status"," "+r.data),this.setState({needsFaucet:!1}),e.next=19;break;case 15:e.prev=15,e.t0=e.catch(1),console.error(e.t0),(0,w.showError)("Error Requesting Faucet Tokens");case 19:case"end":return e.stop()}},e,this,[[1,15]])}));return e}()},{key:"web3Disabled",value:function(){var e=this.props.web3Service;return!(e.initialized&&e.connectedToMetaMask&&void 0!==e.accounts&&e.accounts.length>0&&this.state.MIN_FEE)}},{key:"hasFaucet",value:function(){function e(){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(){var t,r,a;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.web3Service,e.next=3,t.awaitInitialized();case 3:return r=t.web3,a=r.isAddress(y.default[this.activeApp][t.network].FAUCET_ADDRESS),this.setState({hasFaucet:a}),e.abrupt("return",a);case 7:case"end":return e.stop()}},e,this)}));return e}()},{key:"start",value:function(){throw new Error("Implement me")}},{key:"render",value:function(){throw new Error("Override me")}}]),t}(_.Component);t.default=x},493:function(e,t,r){e.exports=r(494)},494:function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(9),u=a(n),s=r(10),o=a(s),i=r(12),l=a(i),c=r(14),f=a(c),d=r(6),p=a(d),m=r(4),h=a(m),b=r(5),v=a(b),_=r(7),N=a(_),k=r(8),w=a(k),E="D:\\Matt\\Downloads\\New folder\\work-dont touch\\cdd\\pages\\debt\\index.js?entry",y=r(0),x=a(y),F=r(21),T=a(F),M=r(495),D=a(M),S=function(e){function t(){return(0,h.default)(this,t),(0,N.default)(this,(t.__proto__||(0,p.default)(t)).apply(this,arguments))}return(0,w.default)(t,e),(0,v.default)(t,[{key:"render",value:function(){return x.default.createElement(T.default,(0,l.default)({},(0,f.default)({},this.props,{activeApp:"debt"}),{__source:{fileName:E,lineNumber:13}}),x.default.createElement(D.default,{__source:{fileName:E,lineNumber:14}}))}}],[{key:"getInitialProps",value:function(){function e(e){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(t){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",T.default.getInitialProps(t));case 1:case"end":return e.stop()}},e,this)}));return e}()}]),t}(x.default.Component);t.default=S},495:function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,u,s=r(74),o=a(s),i=r(136),l=a(i),c=r(9),f=a(c),d=r(10),p=a(d),m=r(6),h=a(m),b=r(4),v=a(b),_=r(5),N=a(_),k=r(7),w=a(k),E=r(8),y=a(E),x=r(85),F=a(x),T="D:\\Matt\\Downloads\\New folder\\work-dont touch\\cdd\\components\\debt\\Home.js",M=r(0),D=a(M),S=r(22),g=a(S),A=r(15),I=r(27),C=r(164),W=a(C),P="",q=(n=(0,A.inject)("web3Service"))(u=(0,A.observer)(u=function(e){function t(e){var r=this;(0,v.default)(this,t);var a=(0,w.default)(this,(t.__proto__||(0,h.default)(t)).call(this,"debt",e));return a.onWatch=(0,p.default)(f.default.mark(function e(){return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:(0,F.default)(t.prototype.__proto__||(0,h.default)(t.prototype),"onWatch",a).call(a,"/debt/step-5");case 1:case"end":return e.stop()}},e,r)})),P=I.NAVIGATION_STEPS[a.activeApp],a}return(0,y.default)(t,e),(0,N.default)(t,[{key:"componentDidMount",value:function(){(0,F.default)(t.prototype.__proto__||(0,h.default)(t.prototype),"componentDidMount",this).call(this)}},{key:"start",value:function(){g.default.push("/debt/step-1")}},{key:"render",value:function(){return D.default.createElement("div",{__source:{fileName:T,lineNumber:34}},D.default.createElement("section",{className:"home",__source:{fileName:T,lineNumber:35}},D.default.createElement("div",{className:"crowdsale",__source:{fileName:T,lineNumber:36}},D.default.createElement("div",{className:"container",__source:{fileName:T,lineNumber:37}},D.default.createElement("h1",{className:"title",__source:{fileName:T,lineNumber:38}},"Welcome to Debt Contract  DAPP "),D.default.createElement("p",{className:"description",__source:{fileName:T,lineNumber:39}},"This DAPP (Decentralized App) allows anyone to deploy their own Debt Smart Contract easily,",D.default.createElement("br",{__source:{fileName:T,lineNumber:40}}),"to serve as mediator between the two parties of a loan agreement..",D.default.createElement("br",{__source:{fileName:T,lineNumber:41}}),"The steps ahead will help you set up the features of your very own Debt Dmart Contract.",D.default.createElement("br",{__source:{fileName:T,lineNumber:43}}),D.default.createElement("br",{__source:{fileName:T,lineNumber:43}}),"* Click ",D.default.createElement("a",{href:"#",onClick:this.onWatch,__source:{fileName:T,lineNumber:44}},"here"),", if you already have a deployed contract."),D.default.createElement("div",{className:"buttons",__source:{fileName:T,lineNumber:46}},D.default.createElement("button",{className:"button button_fill button_mullayer",onClick:this.onStart,disabled:this.web3Disabled(),__source:{fileName:T,lineNumber:47}},"Start"),D.default.createElement("br",{__source:{fileName:T,lineNumber:48}}),this.state.needsFaucet&&this.state.hasFaucet&&D.default.createElement("button",{className:"button button_fill button_mullayer",onClick:this.getTestnetTokens,__source:{fileName:T,lineNumber:50}},"Get Testnet DAY Tokens")),D.default.createElement("p",{className:"description",__source:{fileName:T,lineNumber:53}},"*This tool requires ",D.default.createElement("b",{__source:{fileName:T,lineNumber:54}},D.default.createElement("a",{href:"https://metamask.io/",target:"_blank",__source:{fileName:T,lineNumber:54}},"MetaMask")," ")," extension. Besides, the ETH address which will create the smart contract has to have an amount of ETH for the contract deployment and also ",this.state.MIN_FEE/1e18," DAY for fees. For more information read these ",D.default.createElement("a",{href:"https://blog.chronologic.network/chronos-platform/home",target:"_blank",__source:{fileName:T,lineNumber:56}},"articles"),"."))),D.default.createElement("div",{className:"process",__source:{fileName:T,lineNumber:60}},D.default.createElement("div",{className:"container",__source:{fileName:T,lineNumber:61}},(0,l.default)(P).map(function(e){var t=(0,o.default)(e,2),r=t[0],a=t[1],n=a.iconClassName,u=a.description,s=a.title;return D.default.createElement("div",{className:"process-item",key:r,__source:{fileName:T,lineNumber:64}},D.default.createElement("div",{className:"step-icons "+n,__source:{fileName:T,lineNumber:65}}),D.default.createElement("p",{className:"title",__source:{fileName:T,lineNumber:66}},s),D.default.createElement("p",{className:"description",__source:{fileName:T,lineNumber:67}},u))})))))}}]),t}(W.default))||u)||u;t.default=q},85:function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(6),u=a(n),s=r(95),o=a(s);t.default=function e(t,r,a){null===t&&(t=Function.prototype);var n=(0,o.default)(t,r);if(void 0===n){var s=(0,u.default)(t);return null===s?void 0:e(s,r,a)}if("value"in n)return n.value;var i=n.get;if(void 0!==i)return i.call(a)}}},[493]);
            return { page: comp.default }
          })
        