(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{410:function(e,t,a){"use strict";a.d(t,"E",function(){return s}),a.d(t,"I",function(){return o}),a.d(t,"H",function(){return i}),a.d(t,"j",function(){return l}),a.d(t,"x",function(){return m}),a.d(t,"s",function(){return p}),a.d(t,"K",function(){return u}),a.d(t,"k",function(){return d}),a.d(t,"d",function(){return g}),a.d(t,"D",function(){return h}),a.d(t,"y",function(){return f}),a.d(t,"z",function(){return E}),a.d(t,"t",function(){return b}),a.d(t,"q",function(){return y}),a.d(t,"r",function(){return v}),a.d(t,"l",function(){return k}),a.d(t,"a",function(){return w}),a.d(t,"g",function(){return x}),a.d(t,"v",function(){return j}),a.d(t,"u",function(){return O}),a.d(t,"p",function(){return C}),a.d(t,"o",function(){return N}),a.d(t,"m",function(){return P}),a.d(t,"i",function(){return U}),a.d(t,"e",function(){return B}),a.d(t,"B",function(){return T}),a.d(t,"J",function(){return S}),a.d(t,"C",function(){return L}),a.d(t,"c",function(){return q}),a.d(t,"w",function(){return F}),a.d(t,"b",function(){return A}),a.d(t,"h",function(){return I}),a.d(t,"A",function(){return R}),a.d(t,"f",function(){return _}),a.d(t,"n",function(){return z}),a.d(t,"F",function(){return D}),a.d(t,"G",function(){return W});var n=a(119),r=a(109),c=a(550),s=function(e){e?c.defaults.headers.common["x-access-token"]=e:delete c.defaults.headers.common["x-access-token"]},o=function(e){return c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/auth/signup"),data:e})},i=function(e){return c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/auth/signin"),data:e})},l=function(){return c.get("".concat("http://pgweb.pangeamt.com:3000","/api/engines"))},m=function(){return c.get("".concat("http://pgweb.pangeamt.com:3000","/api/engines/load"))},p=function(e){return c.get("".concat("http://pgweb.pangeamt.com:3000","/api/process/").concat(e))},u=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/process/").concat(e))},d=function(){return c.get("".concat("http://pgweb.pangeamt.com:3000","/api/typeOfPermits/engines"))},g=function(){return c.delete("".concat("http://pgweb.pangeamt.com:3000","/api/notification"))},h=function(e){return c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/process_file"),data:e})},f=function(e){return c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/process/processFile"),data:e})},E=function(e){return c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/process/quoteFile"),data:e})},b=function(){var e=r.a.getToken();return c.defaults.headers.common["x-access-token"]=e,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/process/user"))},y=function(){var e=r.a.getToken();return c.defaults.headers.common["x-access-token"]=e,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/process/process"))},v=function(e){return c.get("".concat("http://pgweb.pangeamt.com:3000","/api/process/getProcessByListId"),{params:Object(n.a)({},e)})},k=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/billing"),{params:Object(n.a)({},e)})},w=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/billing"),data:Object(n.a)({},e)})},x=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/billing"),data:Object(n.a)({},e)})},j=function(){var e=r.a.getToken();return c.defaults.headers.common["x-access-token"]=e,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/users/listAll"))},O=function(){var e=r.a.getToken();return c.defaults.headers.common["x-access-token"]=e,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/users/dashboard/user"))},C=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/users/dashboard/user"),data:{id:e}})},N=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/users/dashboard/client"),data:{id:e}})},P=function(){var e=r.a.getToken();return c.defaults.headers.common["x-access-token"]=e,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/users/dashboard/client"))},U=function(){var e=r.a.getToken();return c.defaults.headers.common["x-access-token"]=e,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/users/dashboard/admin"))},B=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/users/create"),data:e})},T=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/users/remove"),data:e})},S=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/users/update"),data:e})},L=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/users/profile"),data:e})},q=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/users/password"),data:e})},F=function(){var e=r.a.getToken();return c.defaults.headers.common["x-access-token"]=e,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/typeOfPermits/list"))},A=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"post",url:"".concat("http://pgweb.pangeamt.com:3000","/api/typeOfPermits/add"),data:e})},I=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/typeOfPermits/edit"),data:e})},R=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/typeOfPermits/remove"),data:e})},_=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/typeOfPermits/default"),data:e})},z=function(){var e=r.a.getToken();return c.defaults.headers.common["x-access-token"]=e,c.get("".concat("http://pgweb.pangeamt.com:3000","/api/configuration"))},D=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/email"),data:e})},W=function(e){var t=r.a.getToken();return c.defaults.headers.common["x-access-token"]=t,c({method:"put",url:"".concat("http://pgweb.pangeamt.com:3000","/api/paypal"),data:e})}},426:function(e,t,a){"use strict";var n={hasErrors:function(e){return Object.keys(e).some(function(t){return e[t]})},getBase64:function(e){return new Promise(function(t,a){var n=new FileReader;n.readAsDataURL(e);var r={fileName:e.name,fileType:e.type};n.onload=function(){r.file=n.result,t(r)},n.onerror=function(e){a(e)}})},checkFile:function(e,t){var a=e.name.substr(e.name.lastIndexOf(".")+1);return!!new RegExp(t,"gi").test(a)},getStatus:function(e){return(e=parseInt(e))<0?"Processing Error":3===e?"Waiting":5===e?"Waiting Quoting":6===e?"Quoting":7===e?"Quotes Ready":17===e?"Pending Accept/Reject":20===e?"Preprocessing":30===e?"Processing":40===e?"PostProcessing":100===e?"Finished":110===e||120===e?"Downloaded":"Waiting"},languages:{en:"English",es:"Spanish",el:"Greek",fa:"Persian",de:"Deutsch",nl:"Dutch",ja:"Japanese",pt:"Portuguese Brazil",pp:"Portuguese Portugal",sv:"Swedish",zh:"Chinese",fr:"French",it:"Italian",pl:"Polish",ru:"Russian",va:"Valencian",ar:"Arabic",ca:"Catalan",ko:"Korean",sl:"Slovenian",sk:"Slovak",auto:"Auto"},getStatusByText:function(e){return{processing_error:"Processing Error",waiting:"Waiting",waiting_quoting:"Waiting Quoting",quoting:"Quoting",quote_ready:"Quotes Ready",pending_accept_reject:"Pending Accept/Reject",preprocessing:"Pre processing",processing:"Processing",post_processing:"Post Processing",finished:"Finished",downloaded:"Downloaded"}[e]}};t.a=n},618:function(e,t,a){"use strict";a(166);var n=a(101),r=(a(411),a(415)),c=(a(412),a(414)),s=(a(432),a(438)),o=(a(413),a(400)),i=(a(405),a(404)),l=a(417),m=a.n(l),p=a(418),u=a(31),d=a(32),g=a(34),h=a(33),f=a(35),E=a(408),b=a(0),y=a.n(b),v=a(503),k=a.n(v),w=a(67),x=a(37),j=a(409),O=a(410),C=a(426);function N(){var e=Object(E.a)(["\n  &.antd-pro-result-result .antd-pro-result-icon > .antd-pro-result-error {\n    color: #f58722;\n  }\n"]);return N=function(){return e},e}var P=Object(j.b)(k.a)(N()),U=function(e){function t(){var e,a;Object(u.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(g.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(r)))).state={process:null,loading:!0},a.componentDidMount=function(){a.fetchProcess()},a.fetchProcess=Object(p.a)(m.a.mark(function e(){var t,n,r,c,s;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=a.props,n=t.dashboard,r=t.history,!(c=t.match.params)||!c.uuid){e.next=6;break}return e.next=4,Object(O.K)(c.uuid);case 4:(s=e.sent).data?a.setState({process:s.data}):n&&r.push("/dashboard/process-services");case 6:a.setState({loading:!1});case 7:case"end":return e.stop()}},e)})),a.goBack=function(){var e=a.props,t=e.dashboard,n=e.history;t&&n.push("/dashboard/process-services")},a}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e,t=this.props.intl.messages,a=y.a.createElement(i.a,{onClick:this.goBack,type:"primary"},t.default.goBack.toUpperCase()),l=y.a.createElement("div",null,y.a.createElement("div",{style:{fontSize:16,color:"rgba(0, 0, 0, 0.85)",fontWeight:500,marginBottom:16}},t.payment.cancel.detailsOfTheProcess.toUpperCase(),"\uff1a"),y.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.filename.toUpperCase(),y.a.createElement("span",{style:{marginLeft:16}},this.state.process?this.state.process.fileName:null)),y.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.nameOfProcess.toUpperCase(),y.a.createElement("span",{style:{marginLeft:16}},this.state.process?(e=this.state.process.processName).charAt(0).toUpperCase()+e.slice(1):null)),y.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.language.toUpperCase(),y.a.createElement("span",{style:{marginLeft:16}},this.state.process?y.a.createElement(y.a.Fragment,null,this.state.process.engineSource.toUpperCase(),y.a.createElement(o.a,{type:"arrow-right"}),this.state.process.engineTarget.toUpperCase()):null)),y.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.status.toUpperCase(),y.a.createElement("span",{style:{marginLeft:16}},this.state.process?C.a.getStatusByText(this.state.process.status):null)),this.state.process&&this.state.process.quoteSelected&&y.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.quotedPrice.toUpperCase(),y.a.createElement("span",{style:{marginLeft:16}},this.state.process?y.a.createElement("div",null,y.a.createElement(o.a,{type:"euro"})," \xa0",this.state.process.quoteSelected.price):null)));return this.state.loading?y.a.createElement("div",null):y.a.createElement(n.a,{spinning:this.state.loading,tip:"Loading..."},y.a.createElement(r.a,{justify:"center",type:"flex"},y.a.createElement(c.a,{xs:24,md:14},y.a.createElement(s.a,{style:{margin:24}},y.a.createElement(P,{type:"error",title:t.payment.cancel.canceled,description:t.payment.cancel.paymentProcessCanceled.toUpperCase(),extra:l,actions:a})))))}}]),t}(y.a.Component);t.a=Object(x.g)(Object(w.c)(U))},619:function(e,t,a){"use strict";a(166);var n=a(101),r=(a(411),a(415)),c=(a(412),a(414)),s=(a(432),a(438)),o=(a(413),a(400)),i=(a(405),a(404)),l=a(417),m=a.n(l),p=a(418),u=a(31),d=a(32),g=a(34),h=a(33),f=a(35),E=a(0),b=a.n(E),y=a(503),v=a.n(y),k=a(67),w=a(37),x=a(410),j=a(426),O=function(e){function t(){var e,a;Object(u.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(g.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(r)))).state={process:null,loading:!0},a.componentDidMount=function(){a.fetchProcess()},a.fetchProcess=Object(p.a)(m.a.mark(function e(){var t,n,r,c,s;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=a.props,n=t.dashboard,r=t.history,!(c=t.match.params)||!c.uuid){e.next=6;break}return e.next=4,Object(x.K)(c.uuid);case 4:(s=e.sent).data?a.setState({process:s.data}):n&&r.push("/dashboard/process-services");case 6:a.setState({loading:!1});case 7:case"end":return e.stop()}},e)})),a.goBack=function(){var e=a.props,t=e.dashboard,n=e.history;return t?n.push("/dashboard/process-services"):n.push("/")},a}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e,t=this.props.intl.messages,a=b.a.createElement(i.a,{onClick:this.goBack,type:"primary"},t.default.goBack.toUpperCase()),l=b.a.createElement("div",null,b.a.createElement("div",{style:{fontSize:16,color:"rgba(0, 0, 0, 0.85)",fontWeight:500,marginBottom:16}},t.payment.cancel.detailsOfTheProcess.toUpperCase(),"\uff1a"),b.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.filename.toUpperCase(),b.a.createElement("span",{style:{marginLeft:16}},this.state.process?this.state.process.fileName:null)),b.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.nameOfProcess.toUpperCase(),b.a.createElement("span",{style:{marginLeft:16}},this.state.process?(e=this.state.process.processName).charAt(0).toUpperCase()+e.slice(1):null)),b.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.language.toUpperCase(),b.a.createElement("span",{style:{marginLeft:16}},this.state.process?b.a.createElement(b.a.Fragment,null,this.state.process.engineSource.toUpperCase(),b.a.createElement(o.a,{type:"arrow-right"}),this.state.process.engineTarget.toUpperCase()):null)),b.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.status.toUpperCase(),b.a.createElement("span",{style:{marginLeft:16}},this.state.process?j.a.getStatusByText(this.state.process.status):null)),this.state.process&&this.state.process.quoteSelected&&b.a.createElement("div",{style:{marginBottom:16}},t.payment.cancel.quotedPrice.toUpperCase(),b.a.createElement("span",{style:{marginLeft:16}},this.state.process?b.a.createElement("div",null,b.a.createElement(o.a,{type:"euro"})," \xa0",this.state.process.quoteSelected.price):null)));return b.a.createElement(n.a,{spinning:this.state.loading,tip:"Loading..."},b.a.createElement(r.a,{justify:"center",type:"flex"},b.a.createElement(c.a,{xs:24,md:14},b.a.createElement(s.a,{style:{margin:24}},b.a.createElement(v.a,{type:"error",title:t.payment.error.canceled,description:t.payment.error.paymentProcessCanceled.toUpperCase(),extra:l,actions:a})))))}}]),t}(b.a.Component);t.a=Object(w.g)(Object(k.c)(O))},623:function(e,t,a){"use strict";a(166);var n=a(101),r=(a(459),a(463)),c=(a(413),a(400)),s=(a(405),a(404)),o=a(417),i=a.n(o),l=a(418),m=a(31),p=a(32),u=a(34),d=a(33),g=a(35),h=a(0),f=a.n(h),E=a(449),b=a(67),y=a(37),v=a(408);function k(){var e=Object(v.a)(["\n  color: #0da44a !important;\n"]);return k=function(){return e},e}var w=a(409).b.h2(k()),x=a(410),j=a(426),O=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},C=function(e){function t(){var e,a;Object(m.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(r)))).state={process:null,loading:!0},a.componentDidMount=function(){a.fetchProcess()},a.fetchProcess=Object(l.a)(i.a.mark(function e(){var t,n,r,c,s;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=a.props,n=t.dashboard,r=t.history,!(c=t.match.params)||!c.uuid){e.next=6;break}return e.next=4,Object(x.K)(c.uuid);case 4:(s=e.sent).data?a.setState({process:s.data}):n&&r.push("/dashboard/process-services");case 6:a.setState({loading:!1});case 7:case"end":return e.stop()}},e)})),a.goBack=function(){var e=a.props,t=e.dashboard,n=e.history;return t?n.push("/dashboard/process-services"):n.push("/")},a}return Object(g.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.dashboard,o=t.intl.messages;f.a.createElement(s.a,{onClick:this.goBack,type:"primary"},o.default.goBack.toUpperCase()),f.a.createElement("div",null,f.a.createElement("div",{style:{fontSize:16,color:"rgba(0, 0, 0, 0.85)",fontWeight:500,marginBottom:16}},o.payment.cancel.detailsOfTheProcess.toUpperCase(),"\uff1a"),f.a.createElement("div",{style:{marginBottom:16}},o.payment.cancel.filename.toUpperCase(),f.a.createElement("span",{style:{marginLeft:16}},this.state.process?this.state.process.fileName:null)),f.a.createElement("div",{style:{marginBottom:16}},o.payment.cancel.nameOfProcess.toUpperCase(),f.a.createElement("span",{style:{marginLeft:16}},this.state.process?O(this.state.process.processName):null)),f.a.createElement("div",{style:{marginBottom:16}},o.payment.cancel.language.toUpperCase(),f.a.createElement("span",{style:{marginLeft:16}},this.state.process?f.a.createElement(f.a.Fragment,null,this.state.process.engineSource.toUpperCase(),f.a.createElement(c.a,{type:"arrow-right"}),this.state.process.engineTarget.toUpperCase()):null)),f.a.createElement("div",{style:{marginBottom:16}},o.payment.cancel.status.toUpperCase(),f.a.createElement("span",{style:{marginLeft:16}},this.state.process?j.a.getStatusByText(this.state.process.status):null)),this.state.process&&this.state.process.quoteSelected&&f.a.createElement("div",{style:{marginBottom:16}},o.payment.cancel.quotedPrice.toUpperCase(),f.a.createElement("span",{style:{marginLeft:16}},this.state.process?f.a.createElement(f.a.Fragment,null,f.a.createElement(c.a,{type:"euro"})," \xa0",this.state.process.quoteSelected.price):null)),!a&&f.a.createElement(r.a,{message:o.process.notificationHelp,type:"info",showIcon:!0}));return f.a.createElement(E.a,{type:"bottom",className:"ui-animate"},f.a.createElement(n.a,{size:"large",tip:"Loading...",spinning:this.state.loading},f.a.createElement("div",{key:"1",className:"row justify-content-md-center"},f.a.createElement("div",{className:"form-card__body col-md-5 p-1"},f.a.createElement("article",{className:"article"},f.a.createElement("div",{className:"box box-default"},f.a.createElement("div",{className:"box-body p-4"},f.a.createElement("section",{className:"form-v1-container"},f.a.createElement(function(){return f.a.createElement("article",{className:"pricing-table-v1"},f.a.createElement("header",null," ",f.a.createElement(w,null,f.a.createElement(c.a,{type:"check-circle"})," ",o.payment.success.canceled)," "),f.a.createElement("p",{className:"pricing-price"},o.payment.success.paymentProcessCanceled.toUpperCase()),f.a.createElement("p",{className:"pricing-price-detail"},!a&&f.a.createElement(r.a,{message:o.process.notificationHelp,type:"info",showIcon:!0})),f.a.createElement("div",{className:"pricing-plan-details"},f.a.createElement("ul",null,f.a.createElement("li",null,f.a.createElement("div",{className:"row justify-content-md-center"},f.a.createElement("div",{className:"col-md-6 p-1"},f.a.createElement(c.a,{type:"check"})," ",o.payment.cancel.filename.toUpperCase()),f.a.createElement("div",{className:"col-md-6 p-1"},e.state.process?e.state.process.fileName:null))),f.a.createElement("li",null,f.a.createElement("div",{className:"row justify-content-md-center"},f.a.createElement("div",{className:"col-md-6 p-1"},f.a.createElement(c.a,{type:"check"})," ",o.payment.cancel.nameOfProcess.toUpperCase()),f.a.createElement("div",{className:"col-md-6 p-1"},e.state.process?O(e.state.process.processName):null))),f.a.createElement("li",null,f.a.createElement("div",{className:"row justify-content-md-center"},f.a.createElement("div",{className:"col-md-6 p-1"},f.a.createElement(c.a,{type:"check"})," ",o.payment.cancel.language.toUpperCase()),f.a.createElement("div",{className:"col-md-6 p-1"},e.state.process?f.a.createElement(f.a.Fragment,null,e.state.process.engineSource.toUpperCase(),f.a.createElement(c.a,{type:"arrow-right"}),e.state.process.engineTarget.toUpperCase()):null))),f.a.createElement("li",null,f.a.createElement("div",{className:"row justify-content-md-center"},f.a.createElement("div",{className:"col-md-6 p-1"},f.a.createElement(c.a,{type:"check"})," ",o.payment.cancel.status.toUpperCase()),f.a.createElement("div",{className:"col-md-6 p-1"},e.state.process?j.a.getStatusByText(e.state.process.status):null))),f.a.createElement("li",null,f.a.createElement("div",{className:"row justify-content-md-center"},f.a.createElement("div",{className:"col-md-6 p-1"},f.a.createElement(c.a,{type:"check"})," ",o.payment.cancel.quotedPrice.toUpperCase()),f.a.createElement("div",{className:"col-md-6 p-1"},e.state.process?f.a.createElement(f.a.Fragment,null,f.a.createElement(c.a,{type:"euro"})," \xa0",e.state.process.quoteSelected.price.toFixed(2)):null))))),f.a.createElement("footer",null,f.a.createElement(s.a,{onClick:e.goBack,type:"primary",className:"btn-cta w-100"},o.default.goBack.toUpperCase())))},null)))))))))}}]),t}(f.a.Component);t.a=Object(y.g)(Object(b.c)(C))},838:function(e,t,a){},839:function(e,t,a){e.exports=a.p+"static/media/background.1ae982ae.jpg"},840:function(e,t,a){},866:function(e,t,a){"use strict";a.r(t);var n=a(31),r=a(32),c=a(34),s=a(33),o=a(35),i=a(0),l=a.n(i),m=a(37),p=a(64),u=a.n(p),d=a(66),g=(a(475),a(505)),h=a(408),f=a(449),E=a(409),b=(a(473),a(507)),y=(a(405),a(404)),v=(a(413),a(400)),k=(a(474),a(469)),w=a(25),x=a(67),j=a(15),O=a(100),C=a(48);a(838);function N(){var e=Object(h.a)(["\n  overflow: hidden;\n  padding-left: 40px;\n  float: left;\n  height: 64px;\n  line-height: 64px;\n  text-decoration: none;\n  white-space: nowrap;\n  img {\n    height: 60px;\n    margin-right: 16px;\n  }\n"]);return N=function(){return e},e}var P=g.a.Header,U=k.b.SubMenu,B=E.b.div(N()),T=Object(w.c)(function(e){return{lang:e.rootReducer.auth.lang}},function(e){return{authChangeLang:Object(j.a)(C.changeLang,e)}})(Object(x.c)(function(e){var t=e.intl.messages,a=l.a.createElement(k.b,null,l.a.createElement(k.b.Item,{key:"en",disabled:"en"===e.lang,onClick:function(){e.authChangeLang("en")}},l.a.createElement("span",{role:"img","aria-label":"English"},"\ud83c\uddfa\ud83c\uddf8"),t.languages.en),l.a.createElement(k.b.Item,{key:"es",disabled:"es"===e.lang,onClick:function(){e.authChangeLang("es")}},l.a.createElement("span",{role:"img","aria-label":"Spanish"},"\ud83c\uddea\ud83c\uddf8"),t.languages.es)),n=l.a.createElement(k.b,null,l.a.createElement(U,{title:"Language"},a),l.a.createElement(k.b.Item,null,l.a.createElement(O.a,{className:"list-inline-item visible-sm ",to:"/main/signup"},l.a.createElement(v.a,{type:"enter"}),"\xa0 ",t.default.signUp)),l.a.createElement(k.b.Item,null,l.a.createElement(O.a,{className:"list-inline-item visible-sm ",to:"/main/signin"},l.a.createElement(v.a,{type:"login"}),"\xa0 ",t.default.signIn)));return l.a.createElement(P,{className:"app-header "},l.a.createElement("div",{className:"app-header-inner change-header"},l.a.createElement("div",{className:"header-left"},l.a.createElement("div",{className:"list-unstyled list-inline"},l.a.createElement(O.a,{to:"/main",className:"list-inline-item"},l.a.createElement(B,null,l.a.createElement("img",{alt:"logo",src:"/images/logo-authenticityai_horizontal-color-01.png"}))))),l.a.createElement("div",{className:"header-right"},l.a.createElement("div",{className:"list-unstyled list-inline"},l.a.createElement(b.a,{overlay:n,className:"list-inline-item ",trigger:["click"],placement:"bottomRight"},l.a.createElement(O.a,{to:"#",className:"list-inline-item hidden-sm"},l.a.createElement(y.a,{type:"primary",shape:"circle",icon:"arrow-down"}))),l.a.createElement(b.a,{overlay:a,className:"list-inline-item ",trigger:["click"],placement:"bottomRight"},l.a.createElement(O.a,{to:"#",className:"list-inline-item visible-sm"},l.a.createElement(y.a,{type:"primary",shape:"circle",icon:"global"}))),l.a.createElement(O.a,{className:"list-inline-item visible-sm ",to:"/main/signup"},l.a.createElement(y.a,{type:"primary"},t.default.signUp)),l.a.createElement(O.a,{className:"list-inline-item visible-sm ",to:"/main/signin"},l.a.createElement(y.a,{type:"primary"},t.default.signIn))))))})),S=a(839),L=a.n(S);function q(){var e=Object(h.a)(["\n  background-image: url(",") !important;\n  background-size: cover !important;\n  background-position: center center !important;\n  min-height: 100vh !important;\n"]);return q=function(){return e},e}var F=Object(E.b)(g.a)(q(),L.a),A=function(e){return l.a.createElement(F,null,l.a.createElement(T,null),l.a.createElement(f.a,{type:"bottom",className:"ui-animate"},e.children))};function I(){var e=Object(h.a)(["\n  min-height: 100vh;\n"]);return I=function(){return e},e}var R=g.a.Content,_=Object(E.b)(R)(I()),z=function(e){return l.a.createElement(_,null,e.children)},D=a(618),W=a(619),Q=a(623);a(840);a.d(t,"default",function(){return K});var K=function(e){function t(){return Object(n.a)(this,t),Object(c.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(o.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=u()({loader:function(){return Promise.all([a.e(0),a.e(1),a.e(9),a.e(16)]).then(a.bind(null,867))},loading:d.a}),t=u()({loader:function(){return Promise.all([a.e(10),a.e(17)]).then(a.bind(null,863))},loading:d.a}),n=u()({loader:function(){return Promise.all([a.e(0),a.e(1),a.e(3),a.e(11),a.e(19)]).then(a.bind(null,870))},loading:d.a}),r=u()({loader:function(){return Promise.all([a.e(0),a.e(14)]).then(a.bind(null,869))},loading:d.a}),c=u()({loader:function(){return a.e(20).then(a.bind(null,864))},loading:d.a}),s=u()({loader:function(){return Promise.all([a.e(0),a.e(1),a.e(3),a.e(15),a.e(18)]).then(a.bind(null,868))},loading:d.a}),o=function(e){var t=e.children;return l.a.createElement(z,null,t)};return l.a.createElement(A,null,l.a.createElement(m.d,null,l.a.createElement(m.b,{exact:!0,path:"/main",component:t}),l.a.createElement(m.b,{exact:!0,path:"/main/process",component:e}),l.a.createElement(m.b,{exact:!0,path:"/main/process/pay",component:s}),l.a.createElement(m.b,{exact:!0,path:"/main/download/:uuid",component:c}),l.a.createElement(m.b,{exact:!0,path:"/main/process/:uuid/success",render:function(){return l.a.createElement(o,null,l.a.createElement(Q.a,null))}}),l.a.createElement(m.b,{exact:!0,path:"/main/process/:uuid/cancel",render:function(){return l.a.createElement(o,null,l.a.createElement(D.a,null))}}),l.a.createElement(m.b,{exact:!0,path:"/main/process/:uuid/error",render:function(){return l.a.createElement(o,null,l.a.createElement(W.a,null))}}),l.a.createElement(m.b,{exact:!0,path:"/main/signin",component:n}),l.a.createElement(m.b,{exact:!0,path:"/main/signup",component:r}),l.a.createElement(m.b,{render:function(){return l.a.createElement(m.a,{to:"/main/404"})}})))}}]),t}(i.Component)}}]);
//# sourceMappingURL=13.49c3a986.chunk.js.map