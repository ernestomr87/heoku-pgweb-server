(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{421:function(e,n,t){"use strict";function a(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=[],a=!0,o=!1,r=void 0;try{for(var i,s=e[Symbol.iterator]();!(a=(i=s.next()).done)&&(t.push(i.value),!n||t.length!==n);a=!0);}catch(c){o=!0,r=c}finally{try{a||null==s.return||s.return()}finally{if(o)throw r}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}t.d(n,"a",function(){return a})},574:function(e,n,t){"use strict";var a=t(0),o=t.n(a),r=t(400),i=t.n(r),s=t(397),c=t.n(s),l=t(97),u=t.n(l),m=t(393),p=t.n(m),f=t(396),d=t.n(f),y=t(394),v=t.n(y),g=t(395),h=t.n(g),C=t(1),b=t.n(C),E=t(46),N=t.n(E),w=t(409),k=t(438),x=t(18),T=t.n(x),j=function(e){function n(){var e,t,a,o;p()(this,n);for(var r=arguments.length,i=Array(r),s=0;s<r;s++)i[s]=arguments[s];return t=a=v()(this,(e=n.__proto__||Object.getPrototypeOf(n)).call.apply(e,[this].concat(i))),a.close=function(e){e&&e.stopPropagation(),a.clearCloseTimer(),a.props.onClose()},a.startCloseTimer=function(){a.props.duration&&(a.closeTimer=setTimeout(function(){a.close()},1e3*a.props.duration))},a.clearCloseTimer=function(){a.closeTimer&&(clearTimeout(a.closeTimer),a.closeTimer=null)},o=t,v()(a,o)}return h()(n,e),d()(n,[{key:"componentDidMount",value:function(){this.startCloseTimer()}},{key:"componentDidUpdate",value:function(e){(this.props.duration!==e.duration||this.props.update)&&this.restartCloseTimer()}},{key:"componentWillUnmount",value:function(){this.clearCloseTimer()}},{key:"restartCloseTimer",value:function(){this.clearCloseTimer(),this.startCloseTimer()}},{key:"render",value:function(){var e,n=this.props,t=n.prefixCls+"-notice",a=(e={},c()(e,""+t,1),c()(e,t+"-closable",n.closable),c()(e,n.className,!!n.className),e);return o.a.createElement("div",{className:T()(a),style:n.style,onMouseEnter:this.clearCloseTimer,onMouseLeave:this.startCloseTimer,onClick:n.onClick},o.a.createElement("div",{className:t+"-content"},n.children),n.closable?o.a.createElement("a",{tabIndex:"0",onClick:this.close,className:t+"-close"},n.closeIcon||o.a.createElement("span",{className:t+"-close-x"})):null)}}]),n}(a.Component);j.propTypes={duration:b.a.number,onClose:b.a.func,children:b.a.any,update:b.a.bool,closeIcon:b.a.node},j.defaultProps={onEnd:function(){},onClose:function(){},duration:1.5,style:{right:"50%"}};var O=j,_=0,I=Date.now();var F=function(e){function n(){var e,t,a,o;p()(this,n);for(var r=arguments.length,i=Array(r),s=0;s<r;s++)i[s]=arguments[s];return t=a=v()(this,(e=n.__proto__||Object.getPrototypeOf(n)).call.apply(e,[this].concat(i))),a.state={notices:[]},a.add=function(e){var n=e.key=e.key||"rcNotification_"+I+"_"+_++,t=a.props.maxCount;a.setState(function(a){var o=a.notices,r=o.map(function(e){return e.key}).indexOf(n),i=o.concat();return-1!==r?i.splice(r,1,e):(t&&o.length>=t&&(e.updateKey=i[0].updateKey||i[0].key,i.shift()),i.push(e)),{notices:i}})},a.remove=function(e){a.setState(function(n){return{notices:n.notices.filter(function(n){return n.key!==e})}})},o=t,v()(a,o)}return h()(n,e),d()(n,[{key:"getTransitionName",value:function(){var e=this.props,n=e.transitionName;return!n&&e.animation&&(n=e.prefixCls+"-"+e.animation),n}},{key:"render",value:function(){var e,n=this,t=this.props,a=this.state.notices,r=a.map(function(e,r){var i=Boolean(r===a.length-1&&e.updateKey),s=e.updateKey?e.updateKey:e.key,c=Object(k.a)(n.remove.bind(n,e.key),e.onClose);return o.a.createElement(O,u()({prefixCls:t.prefixCls},e,{key:s,update:i,onClose:c,onClick:e.onClick,closeIcon:t.closeIcon}),e.content)}),i=(e={},c()(e,t.prefixCls,1),c()(e,t.className,!!t.className),e);return o.a.createElement("div",{className:T()(i),style:t.style},o.a.createElement(w.a,{transitionName:this.getTransitionName()},r))}}]),n}(a.Component);F.propTypes={prefixCls:b.a.string,transitionName:b.a.string,animation:b.a.oneOfType([b.a.string,b.a.object]),style:b.a.object,maxCount:b.a.number,closeIcon:b.a.node},F.defaultProps={prefixCls:"rc-notification",animation:"fade",style:{top:65,left:"50%"}},F.newInstance=function(e,n){var t=e||{},a=t.getContainer,r=i()(t,["getContainer"]),s=document.createElement("div");a?a().appendChild(s):document.body.appendChild(s);var c=!1;N.a.render(o.a.createElement(F,u()({},r,{ref:function(e){c||(c=!0,n({notice:function(n){e.add(n)},removeNotice:function(n){e.remove(n)},component:e,destroy:function(){N.a.unmountComponentAtNode(s),s.parentNode.removeChild(s)}}))}})),s)};var q,S,A,P,D=F,K=t(398),U=3,M=1,J="ant-message",L="move-up";var W={open:function(e){var n=void 0!==e.duration?e.duration:U,t={info:"info-circle",success:"check-circle",error:"close-circle",warning:"exclamation-circle",loading:"loading"}[e.type],o=M++,r=new Promise(function(r){var i=function(){return"function"===typeof e.onClose&&e.onClose(),r(!0)};!function(e){S?e(S):D.newInstance({prefixCls:J,transitionName:L,style:{top:q},getContainer:A,maxCount:P},function(n){S?e(S):(S=n,e(n))})}(function(r){var s=a.createElement(K.a,{type:t,theme:"loading"===t?"outlined":"filled"});r.notice({key:o,duration:n,style:{},content:a.createElement("div",{className:"".concat(J,"-custom-content").concat(e.type?" ".concat(J,"-").concat(e.type):"")},e.icon?e.icon:t?s:"",a.createElement("span",null,e.content)),onClose:i})})}),i=function(){S&&S.removeNotice(o)};return i.then=function(e,n){return r.then(e,n)},i.promise=r,i},config:function(e){void 0!==e.top&&(q=e.top,S=null),void 0!==e.duration&&(U=e.duration),void 0!==e.prefixCls&&(J=e.prefixCls),void 0!==e.getContainer&&(A=e.getContainer),void 0!==e.transitionName&&(L=e.transitionName,S=null),void 0!==e.maxCount&&(P=e.maxCount,S=null)},destroy:function(){S&&(S.destroy(),S=null)}};["success","info","warning","error","loading"].forEach(function(e){W[e]=function(n,t,a){return"function"===typeof t&&(a=t,t=void 0),W.open({content:n,duration:t,type:e,onClose:a})}}),W.warn=W.warning;n.a=W},794:function(e,n,t){},811:function(e,n,t){"use strict";t.r(n);var a=t(0),o=t.n(a),r=t(417),i=t(421),s=t(404),c=t(805),l=t(574),u=t(446),m=t(398),p=t(806),f=t(425),d=t(100),y=t(67),v=t(403),g=t(405);t(794);function h(){var e=Object(s.a)(["\n  display: flex;\n  justify-content: center button {\n    width: 50%;\n  }\n"]);return h=function(){return e},e}var C=c.a.Item,b=g.b.div(h()),E=c.a.create()(Object(y.c)(function(e){var n=e.intl.messages,t=e.form.getFieldDecorator,r=Object(a.useState)(!1),s=Object(i.a)(r,2),y=s[0],g=s[1],h=Object(a.useState)(!1),E=Object(i.a)(h,1)[0],N={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:16}}},w={wrapperCol:{xs:{span:24,offset:0},sm:{span:14,offset:6}}};return o.a.createElement("section",{className:"form-card"},o.a.createElement("div",{className:"form-card__img",style:{backgroundImage:"url('../images/dan-freeman-401296-unsplash.jpg')",height:"200px"}}),o.a.createElement("div",{className:"form-card__body p-lg-5 p-4"},o.a.createElement("section",{className:"form-v1-container"},o.a.createElement("h2",null,"Create an Account"),o.a.createElement(c.a,{onSubmit:function(t){t.preventDefault(),e.form.validateFields(function(t,a){if(!t){var o={fullName:a.fullName,email:a.email,password:a.password};g(!0),Object(v.I)(o).then(function(){l.a.success(n.signup.success),g(!1),e.form.resetFields()}).catch(function(e){400===e.response.status?l.a.error(n.signup.error.email):l.a.error(n.signup.error.all),g(!1)})}})},className:"form-v1"},o.a.createElement(C,Object.assign({},N,{label:o.a.createElement("span",null,n.signup.fullName," \xa0",o.a.createElement(u.a,{title:"What do you want other to call you?"},o.a.createElement(m.a,{type:"question-circle-o"}))),hasFeedback:!0}),t("fullName",{rules:[{required:!0,whitespace:!0,message:n.signup.rules.fullName.required}]})(o.a.createElement(p.a,null))),o.a.createElement(C,Object.assign({},N,{label:"E-mail",hasFeedback:!0}),t("email",{rules:[{type:"email",message:n.signup.rules.email.type},{required:!0,message:n.signup.rules.email.required}]})(o.a.createElement(p.a,null))),o.a.createElement(C,Object.assign({},N,{label:n.signup.password,hasFeedback:!0}),t("password",{rules:[{required:!0,message:n.signup.rules.password.required},{validator:function(n,t,a){var o=e.form;t&&E&&o.validateFields(["confirm"],{force:!0}),a()}}]})(o.a.createElement(p.a,{type:"password"}))),o.a.createElement(C,Object.assign({},N,{label:n.signup.confirm,hasFeedback:!0}),t("confirm",{rules:[{required:!0,message:n.signup.rules.password.confirm},{validator:function(t,a,o){var r=e.form;a&&a!==r.getFieldValue("password")?o(n.signup.rules.password.match):o()}}]})(o.a.createElement(p.a,{type:"password"}))),o.a.createElement(C,w,o.a.createElement(f.a,{loading:y,type:"primary",htmlType:"submit",className:"btn-cta"},y?n.signup.btnSignUpLoad:n.signup.btnSignUp)),o.a.createElement(C,w,o.a.createElement(b,{style:{marginTop:-10}},n.signup.or," \xa0\xa0",o.a.createElement(d.a,{to:"/main/signin",style:{color:"#73d13d"}},n.signup.login)))))))}));n.default=function(e){var n=e.location;return o.a.createElement("div",{className:"container-fluid no-breadcrumb container-mw-lg chapter"},o.a.createElement("article",{className:"article"},o.a.createElement(r.a,{type:"bottom",className:"ui-animate row justify-content-center"},o.a.createElement("div",{className:"col-10 col-sm-10 mb-5",key:"1"}," ",o.a.createElement(E,{location:n})))))}}}]);
//# sourceMappingURL=15.29555c22.chunk.js.map