
          window.__NEXT_REGISTER_PAGE('/', function() {
            var comp = module.exports=webpackJsonp([9],{286:function(e,t,r){e.exports=r(287)},287:function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(15),s=a(n),u=r(17),o=a(u),l=r(19),i=a(l),c=r(4),f=a(c),d=r(1),m=a(d),p=r(2),h=a(p),b=r(5),_=a(b),N=r(6),v=a(N),k="D:\\Matt\\Downloads\\New folder\\work-dont touch\\cdd\\pages\\index.js?entry",w=r(0),E=a(w),x=r(56),T=a(x),y=r(418),F=a(y),g=function(e){function t(){return(0,m.default)(this,t),(0,_.default)(this,(t.__proto__||(0,f.default)(t)).apply(this,arguments))}return(0,v.default)(t,e),(0,h.default)(t,[{key:"render",value:function(){return E.default.createElement(T.default,(0,i.default)({},this.props,{__source:{fileName:k,lineNumber:13}}),E.default.createElement(F.default,{__source:{fileName:k,lineNumber:14}}))}}],[{key:"getInitialProps",value:function(){function e(e){return t.apply(this,arguments)}var t=(0,o.default)(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",T.default.getInitialProps(t));case 1:case"end":return e.stop()}},e,this)}));return e}()}]),t}(E.default.Component);t.default=g},418:function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,s,u=r(53),o=a(u),l=r(185),i=a(l),c=r(15),f=a(c),d=r(17),m=a(d),p=r(4),h=a(p),b=r(1),_=a(b),N=r(2),v=a(N),k=r(5),w=a(k),E=r(6),x=a(E),T="D:\\Matt\\Downloads\\New folder\\work-dont touch\\cdd\\components\\Home.js",y=r(0),F=a(y),g=r(36),M=a(g),S=r(37),D=r(43),I=r(90),A=r(101),P=a(A),C=(n=(0,S.inject)("web3Service"))(s=(0,S.observer)(s=function(e){function t(e){var r=this;(0,_.default)(this,t);var a=(0,w.default)(this,(t.__proto__||(0,h.default)(t)).call(this,e));return a.onStart=function(){var e=(0,m.default)(f.default.mark(function e(t){var n,s,u;return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!a.web3Disabled()){e.next=2;break}return e.abrupt("return");case 2:return n=t.target,n.disabled=!0,s=a.props.web3Service,e.next=7,s.checkBalance();case 7:if(e.sent){e.next=19;break}return e.next=10,(0,I.showInsufficientBalalnce)(a.state.MIN_FEE/1e18);case 10:if("preview"!=(u=e.sent)){e.next=15;break}return e.abrupt("return",a.start());case 15:a.setState({needsFaucet:!0});case 16:return e.abrupt("return",n.disabled=!1);case 19:return e.next=21,s.checkAllowance();case 21:if(e.t0=e.sent,e.t0){e.next=31;break}return e.next=25,(0,I.confirmFeeWithdraw)(a.state.MIN_FEE);case 25:if(e.t1=e.sent,!e.t1){e.next=30;break}return e.next=29,a.reserveTokens();case 29:e.t1=e.sent;case 30:e.t0=e.t1;case 31:if(!e.t0){e.next=35;break}a.start(),e.next=36;break;case 35:n.disabled=!1;case 36:case"end":return e.stop()}},e,r)}));return function(t){return e.apply(this,arguments)}}(),a.state={MIN_FEE:null,needsFaucet:!1},a.getTestnetTokens=a.getTestnetTokens.bind(a),a}return(0,x.default)(t,e),(0,v.default)(t,[{key:"reserveTokens",value:function(){function e(){return t.apply(this,arguments)}var t=(0,m.default)(f.default.mark(function e(){var t,r;return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.web3Service,e.prev=1,e.next=4,t.approveFee();case 4:r=e.sent,(0,I.showInfo)("Token Release Tx Status","TxHash "+r),this.start(),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(1),(0,I.showError)("Could not complete transaction");case 12:case"end":return e.stop()}},e,this,[[1,9]])}));return e}()},{key:"componentDidMount",value:function(){this.getWeb3Fee()}},{key:"getWeb3Fee",value:function(){function e(){return t.apply(this,arguments)}var t=(0,m.default)(f.default.mark(function e(){var t,r;return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=this.props.web3Service,r=this,void 0===t.network||null===t.network){e.next=4;break}return e.abrupt("return",this.setState({MIN_FEE:P.default[t.network].MIN_FEE}));case 4:setTimeout(function(){return r.getWeb3Fee()},200);case 5:case"end":return e.stop()}},e,this)}));return e}()},{key:"getTestnetTokens",value:function(){function e(){return t.apply(this,arguments)}var t=(0,m.default)(f.default.mark(function e(){var t,r;return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.web3Service,e.prev=1,e.next=4,t.requestFromFaucet();case 4:if(r=e.sent,-1!=r.status){e.next=9;break}return e.abrupt("return",(0,I.showError)("Sorry the Faucet is not funded at the moment"));case 9:if(0!=r.status){e.next=11;break}return e.abrupt("return",(0,I.showError)("You have to wait for another "+(r.data/60).toFixed(2)+" min(s) to request Tokens."));case 11:(0,I.showInfo)("Token Faucet request Tx Status","TxHash "+r.data),this.setState({needsFaucet:!1}),e.next=19;break;case 15:e.prev=15,e.t0=e.catch(1),console.error(e.t0),(0,I.showError)("Error Requesting Faucet Tokens");case 19:case"end":return e.stop()}},e,this,[[1,15]])}));return e}()},{key:"web3Disabled",value:function(){var e=this.props.web3Service;return!e.connectedToMetaMask||!(void 0!==e.accounts&&e.accounts.length>0)||!this.state.MIN_FEE}},{key:"start",value:function(){M.default.push("/step-1")}},{key:"render",value:function(){return F.default.createElement("div",{__source:{fileName:T,lineNumber:103}},F.default.createElement("section",{className:"home",__source:{fileName:T,lineNumber:104}},F.default.createElement("div",{className:"crowdsale",__source:{fileName:T,lineNumber:105}},F.default.createElement("div",{className:"container",__source:{fileName:T,lineNumber:106}},F.default.createElement("h1",{className:"title",__source:{fileName:T,lineNumber:107}},"Welcome to the Chronologic's DAPP "),F.default.createElement("p",{className:"description",__source:{fileName:T,lineNumber:108}},"This DAPP (Decentralized App) allows anyone to create his/hers own version of minting token easily.",F.default.createElement("br",{__source:{fileName:T,lineNumber:110}}),"The steps ahead will help you set up the features of your very own version of the DAY token."),F.default.createElement("div",{className:"buttons",__source:{fileName:T,lineNumber:114}},F.default.createElement("button",{className:"button button_fill button_mullayer",onClick:this.onStart,disabled:this.web3Disabled(),__source:{fileName:T,lineNumber:115}},"Start"),F.default.createElement("br",{__source:{fileName:T,lineNumber:116}}),this.state.needsFaucet&&F.default.createElement("button",{className:"button button_fill button_mullayer",onClick:this.getTestnetTokens,__source:{fileName:T,lineNumber:118}},"Get Testnet DAY Tokens")),F.default.createElement("p",{className:"description",__source:{fileName:T,lineNumber:121}},"*This tool requires ",F.default.createElement("b",{__source:{fileName:T,lineNumber:122}},F.default.createElement("a",{href:"https://metamask.io/",target:"_blank",__source:{fileName:T,lineNumber:122}},"MetaMask")," ")," extension. Besides, the ETH address which will create the smart contract has to have an amount of ETH for the contract deployment and also ",this.state.MIN_FEE/1e18," DAY for fees. For more information read these ",F.default.createElement("a",{href:"https://blog.chronologic.network/chronos-platform/home",target:"_blank",__source:{fileName:T,lineNumber:124}},"articles"),"."))),F.default.createElement("div",{className:"process",__source:{fileName:T,lineNumber:128}},F.default.createElement("div",{className:"container",__source:{fileName:T,lineNumber:129}},(0,i.default)(D.NAVIGATION_STEPS).map(function(e){var t=(0,o.default)(e,2),r=t[0],a=t[1],n=a.iconClassName,s=a.description,u=a.title;return F.default.createElement("div",{className:"process-item",key:r,__source:{fileName:T,lineNumber:132}},F.default.createElement("div",{className:"step-icons "+n,__source:{fileName:T,lineNumber:133}}),F.default.createElement("p",{className:"title",__source:{fileName:T,lineNumber:134}},u),F.default.createElement("p",{className:"description",__source:{fileName:T,lineNumber:135}},s))})))))}}]),t}(y.Component))||s)||s;t.default=C}},[286]);
            return { page: comp.default }
          })
        