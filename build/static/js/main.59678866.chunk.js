(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{109:function(e,t,r){"use strict";var o=r(161),a=JSON.parse,s=JSON.stringify,n={clear:function(e){return localStorage&&localStorage.getItem(e)?localStorage.removeItem(e):sessionStorage&&sessionStorage.getItem(e)?sessionStorage.removeItem(e):null},clearAppStorage:function(){localStorage&&localStorage.clear(),sessionStorage&&sessionStorage.clear()},clearToken:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"jwtToken";return n.clear(e)},clearUserInfo:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"userInfo";return n.clear(e)},get:function(e){return localStorage&&localStorage.getItem(e)?a(localStorage.getItem(e))||null:sessionStorage&&sessionStorage.getItem(e)&&a(sessionStorage.getItem(e))||null},getToken:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"jwtToken";return n.get(e)},getUserInfo:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"userInfo";return n.get(e)},set:function(e,t,r){return Object(o.isEmpty)(e)?null:r&&localStorage?localStorage.setItem(t,s(e)):sessionStorage?sessionStorage.setItem(t,s(e)):null},setToken:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"jwtToken";return n.set(e,r,t)},setUserInfo:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"userInfo";return n.set(e,r,t)}};t.a=n},118:function(e,t,r){"use strict";r.r(t),r.d(t,"fetchRequest",function(){return n}),r.d(t,"fetchResponse",function(){return i}),r.d(t,"getEngines",function(){return c}),r.d(t,"selectProcess",function(){return u}),r.d(t,"setProcessSelected",function(){return l}),r.d(t,"changeFileID",function(){return d});var o,a=r(6),s=r(3),n=Object(s.createAction)("fetch request",function(e){return{loading:e}}),i=Object(s.createAction)("fetch response",function(e){return{loading:e}}),c=Object(s.createAction)("get engines",function(e,t){return{engines:e,defaultValue:t}}),u=Object(s.createAction)("select process",function(e){return{selected:e}}),l=Object(s.createAction)("set processSelected",function(e){return{processSelected:e}}),d=Object(s.createAction)("change fileId",function(e){return{fileId:e}});t.default=Object(s.createReducer)((o={},Object(a.a)(o,l,function(e,t){var r=t.processSelected;return Object.assign({},e,{processSelected:r})}),Object(a.a)(o,u,function(e,t){var r=t.selected;return Object.assign({},e,{selected:r})}),Object(a.a)(o,c,function(e,t){var r=t.engines,o=t.defaultValue;return Object.assign({},e,{engines:r,defaultValue:o})}),Object(a.a)(o,d,function(e,t){var r=t.fileId;return Object.assign({},e,{fileId:r})}),Object(a.a)(o,n,function(e){return Object.assign({},e,{loading:!0})}),Object(a.a)(o,i,function(e){return Object.assign({},e,{loading:!1})}),o),{selected:{name:null,engines:[]},loading:!1,engines:[],defaultValue:null,fileId:null,processSelected:null})},136:function(e,t,r){"use strict";r.r(t),r.d(t,"fetchAuth",function(){return c}),r.d(t,"addNotifications",function(){return u}),r.d(t,"changeNotifications",function(){return l});var o,a=r(6),s=r(119),n=r(3),i=r(264),c=Object(n.createAction)("fetch auth",function(e){return{auth:e.auth,accessToken:e.accessToken}}),u=Object(n.createAction)("add  notifications",function(e){return{notifications:e}}),l=Object(n.createAction)("change  notifications",function(e){return{notifications:e}});t.default=Object(n.createReducer)((o={},Object(a.a)(o,l,function(e,t){var r=t.notifications;return Object.assign({},e,{notifications:r})}),Object(a.a)(o,u,function(e,t){var r=t.notifications;return r=i.concat(e.notifications,r),Object(s.a)({},e,{notifications:r})}),o),{notifications:[]})},155:function(e,t){},158:function(e){e.exports={payment:{cancel:{paymentProcessCanceled:"Payment process canceled",canceled:"Canceled",detailsOfTheProcess:"Details of the Process",filename:"Filename",nameOfProcess:"Name of process",language:"Language",status:"Status",quotedPrice:"Quoted price"},error:{paymentProcessCanceled:"Payment process error",canceled:"Error"},success:{paymentProcessCanceled:"Payment process success",canceled:"Success"},question1:"Are you a company of the European Union?",question2:"Are you a citizen of the European Union?",question3:"Other cases.",step1:"Question",step2:"Verification",step3:"Pay",alert:"TAX/VAT/IVA Included",info:"Click in the amount to pay to choose the process mode",modal:"Payment process",next:"Next",previous:"Previous",form:{name:"Name",address:"Address",country:"Country",vattax:"VAT/TAX number",error:{name:"Please input your Name!",address:"Please input your Address!",country:"Please select your country!",vattax:"Please input your VAT/TAX number!"}}},dashboard:{lastWeek:"Last Week",lastMonth:"Last Month",visits:"Visits",dailyVisits:"Daily visits",descriptionOfTheIndicator:"Description of the indicator",numberOfUsers:"Number of users",visitThisWeek:"Visit this week",numberOfProcesses:"Number of Processes",totalExpenses:"Total Expenses",expensesthisWeek:"Expenses this Month",processesThisWeek:"Processes this Month",process:"Processes",processesCompleted:"Processes completed",salesTrend:"Activity trend",lastProcesses:"Last processes",casualUser:"Number of processes for casual users",registerUser:"Number of processes for registered users"},profile:{oldPassword:"Old password",errorOldPassword:"The old password is incorrect",changePassword:"Change password",editProfile:"Edit profile",billinginformation:"Billing information",name:"Name",address:"Address",country:"Country",vattax:"VAT/TAX number",account:"Account"},typeOfPermits:{name:"Name",defaultValue:"Default Value",default:"Default",confirm:"Are you sure delete this Type of Permits?",addPermissionType:"Add permission type",create:"Create permission type",edit:"Edit permission type",updateEngines:"Reload Engines",rules:{name:{required:"Please input Name field!"},defaultValue:{required:"Please input Default Value field!"}}},settings:{mailNotifications:"Mail Notifications",infoNotesEmails:"Manage notifications through the email, select which notification activate.",infoNotesPayPal:"Data of the PayPal account with which transactions are made.",infoNotesProcesses:"Management of different groups (Motors / Processes) that are assigned to different users.",client_id:"Client Id",client_secret:"Client Secret",rules:{client_id:{required:"Please input your Client Id!"},client_secret:{required:"Please confirm your Client Secret!"}}},users:{all:"All Users",create:"Create user",edit:"Edit user",confirmDelete:"Are you sure delete this User?",addUser:"Add user"},languages:{en:"English",es:"Spanish"},menus:{dashboard:"Dashboard",user:"Users",profile:"Profile",logout:"Logout",setting:"Settings",processServices:"Services / Processes"},default:{success:"The action was successful",loading:"Loading",seeMore:"see more",cancel:"Cancel",create:"Create",save:"Save",actions:"Actions",no:"No",yes:"Yes",infoNotes:"Informational Notes",goBack:"Go back",goHome:"Back to Home",notFound:"Sorry, the page you have visited does not exist.",signIn:"Sign In",signUp:"Sign Up",getStarted:"Get Started"},process:{user:"User",client:"Client",drag:"Click or drag file to this area to upload",alert:"You must upload a file before continuing!!",process:"Process type",processText:"Process",source:"Source Language",target:"Target Language",notification:"Notification email",notificationHelp:"The result of the process will be notified via email.",uploading:"Uploading",uploadingLoad:"Start Upload",loading:"Loading",errorProcess:"Hmm, something went wrong",errorProcessSub:"so it looks like your transfer didn't work \u2013 please give it another go",tryAgain:"Try Again",successProcess:"You\u2019re done!",successProcessSub:"Soon you will receive a notification to the mail to notify the completion of the process.",another:"Send another?",listProcess:"List Process",fileName:"File Name",processName:"Process Name",language:"Language",status:"Status",quote:"Quote",finished:"Finished",inProcess:"In Process",paidProcess:"Paid Process",processAFile:"Process a File",subProcessAFile:"Use the language processing service with files",processing:"Processing file",error:{uploadOne:"You can only upload (allowedFiles) file!",uploadTwo:"Image must smaller than 2MB!"},rules:{process:{required:"Please select your Process!"},source:{required:"Please select your Language of origin!"},target:{required:"Please select your output Language!"},email:{type:"The input is not valid E-mail!",required:"Please input your E-mail!"}}},signup:{role:"Role",typeOfPermits:"Type of permits",typeOfUser:"Type of user",typeOfUsers:{nqnp:"No quotes and no payment.",qnp:"With quotes and without payment.",qp:"With quotes and with payment."},password:"Password",fullName:"FullName",confirm:"Confirm password",btnSignUp:"Register",btnSignUpLoad:"Send Data",login:"Login now!",or:"Or",roles:{admin:"Administrator",user:"User",client:"Client"},rules:{fullName:{required:"Please, fullName is required!"},email:{type:"The input is not valid E-mail!",required:"Please input your E-mail!"},password:{required:"Please input your Password!",match:"Two passwords that you enter is inconsistent!",confirm:"Please confirm your password!"}},success:"Registration completed successfully",error:{email:"The email is already in use",all:"There has been an error, please try later"}},signin:{password:"Password",rememberMe:"Remember me",btnSignIn:"Sign me in",btnSignInLoad:"Send Data",register:"register now!",or:"Or",rules:{email:{type:"The input is not valid E-mail!",required:"Please input your E-mail!"},password:{required:"Please input your Password!"}},success:"Signin completed successfully",error:{user:"The user has not been found",password:"The password is invalid",all:"There has been an error, please try later"}},landing:{carousel:{1:{text1:"Cum inani constituam.",text2:"Cum no congue aliquam inermis, cum quem everti cu. Ut pro wisi efficiantur, et vix paulo congue nostro.",text3:"Ut duo ullum novum legimus. At nemore verear eum."},2:{text1:"Nunc ut sapien tincidunt",text2:"Phasellus sodales dolor vitae suscipit neque ac, euismod turpis. Lorem ipsum dolor sit amet",text3:"Dis parturient montes, nascetur ridiculus mus."},3:{text1:"Quisque a lorem",text2:"Curabitur egestas, sapien vitae mattis blandit, magna ligula euismod enim, quis ultricies tortor velit eget metus.",text3:"Maecenas lectus lorem, semper id magna a, efficitur vehicula risus."},4:{text1:"Duis in suscipit felis.",text2:"Nullam laoreet eleifend feugiat. Morbi ut ultricies velit. Vivamus a commodo urna, id porttitor odio.",text3:"Sed tincidunt elementum lorem, ut dapibus lorem pulvinar et."}}}}},159:function(e){e.exports={payment:{cancel:{paymentProcessCanceled:"Proceso de pago cancelado",canceled:"Cancelado",detailsOfTheProcess:"Detalles del Proceso",filename:"Nombre del archivo",nameOfProcess:"Nombre del Proceso",language:"Lenguage",status:"Estado",quotedPrice:"Precio cotizado"},error:{paymentProcessCanceled:"Proceso de pago con error",canceled:"Error"},success:{paymentProcessCanceled:"Proceso de pago satisfactorio",canceled:"Satisfactorio"},question1:"\xbfEres una empresa de la Uni\xf3n Europea?",question2:"\xbfEres ciudadano de la Uni\xf3n Europea?",question3:"Otros casos",step1:"Pregunta",step2:"Verificaci\xf3n",step3:"Pago",alert:"TAX/VAT/IVA Inclu\xeddo",info:"Haga clic en el monto a pagar para elegir el modo de proceso",modal:"Proceso de Pago",next:"Pr\xf3ximo",previous:"Anterior",form:{name:"Nombre",address:"Direcci\xf3n",country:"Pa\xeds",vattax:"VAT/TAX n\xfamero",error:{name:"Por favor ingrese el campo Nombre!",address:"Por favor ingrese el campo Direcci\xf3n!",country:"Por favor seleccione su Pa\xeds!",vattax:"Por favor ingrese el campo del n\xfamero VAT/TAX!"}}},dashboard:{lastWeek:"La semana pasada",lastMonth:"El mes pasado",visits:"Visitas",dailyVisits:"Visitas diarias",descriptionOfTheIndicator:"Descripci\xf3n del indicador",numberOfUsers:"N\xfamero de usuarios",visitThisWeek:"Visita esta semana",numberOfProcesses:"N\xfamero de Procesos",processesThisWeek:"Procesos esta semana",totalExpenses:"Gastos totales",expensesthisWeek:"Gastos esta semana",process:"Procesos",processesCompleted:"Procesos completados",salesTrend:"Tendencia de actividad",lastProcesses:"\xdaltimos procesos",casualUser:"Number of processes for casual users",registerUser:"N\xfamero de procesos para usuarios registrados."},profile:{oldPassword:"Vieja contrase\xf1a",errorOldPassword:"La vieja contrase\xf1a es incorrecta",changePassword:"Cambiar contrase\xf1a",editProfile:"Editar profile",billinginformation:"Informaci\xf3n de facturaci\xf3n",name:"Nombre",address:"Direcci\xf3n",country:"Pa\xeds",vattax:"N\xfamero VAT/TAX",account:"Cuenta"},typeOfPermits:{name:"Nombre",defaultValue:"Valor por defecto",default:"Por defecto",confirm:"\xbfEst\xe1s seguro de eliminar este tipo de permisos?",addPermissionType:"Agregar tipo de permiso",create:"Crear tipo de permiso",edit:"Editar tipo de permiso",updateEngines:"Recargar Motores",rules:{name:{required:"Por favor ingrese el campo Nombre!"},defaultValue:{required:"Por favor ingrese el valor por defecto!"}}},settings:{mailNotifications:"Notificaciones de correo",infoNotesEmails:"Administrar notificaciones a trav\xe9s del correo electr\xf3nico, seleccione qu\xe9 notificaci\xf3n activar.",infoNotesPayPal:"Datos de la cuenta de PayPal con la que se realizan las transacciones.",infoNotesProcesses:"Gesti\xf3n de diferentes grupos (Motores / Procesos) que se asignan a diferentes usuarios.",client_id:"ID del cliente",client_secret:"ID Secreto del cliente",rules:{client_id:{required:"Por favor ingrese su ID de Cliente!"},client_secret:{required:"Por favor, confirme el ID Secreto de su Cliente!"}}},users:{all:"Todos los Usuarios",create:"Crear usuario",edit:"Editar usuario",confirmDelete:"\xbfEst\xe1s seguro de eliminar este usuario?",addUser:"Adicionar usuario"},languages:{en:"Ingles",es:"Espa\xf1ol"},menus:{dashboard:"Tablero",user:"Usuarios",profile:"Perfil",logout:"Salir",setting:"Ajustes",processServices:"Servicios / Procesos"},default:{success:"La acci\xf3n se ha realizado satisfactoriamente",loading:"Cargando",seeMore:"ver m\xe1s",cancel:"Cancelar",create:"Crear",save:"Guardar",actions:"Acciones",no:"No",yes:"Si",infoNotes:"Notas informativas",goBack:"Regresar",goHome:"Volver al Inicio",notFound:"Lo sentimos, la p\xe1gina que has visitado no existe.",signIn:"Log In",signUp:"Registro",getStarted:"Comenzar"},process:{user:"Usuario",client:"Cliente",drag:"Haga clic o arrastre el archivo a esta \xe1rea para subir",alert:"Debes subir un archivo antes de continuar !!",process:"Tipo de proceso",processText:"Procesar",source:"Lenguaje fuente",target:"Lengua de llegada",notification:"Email de notificaci\xf3n",notificationHelp:"El resultado del proceso ser\xe1 notificado v\xeda correo electr\xf3nico.",uploading:"Subiendo",uploadingLoad:"Iniciar la subida",loading:"Cargando",errorProcess:"Hmm, algo sali\xf3 mal",errorProcessSub:"As\xed que parece que tu transferencia no funcion\xf3. Por favor, dale otra oportunidad.",tryAgain:"Int\xe9ntalo de nuevo",successProcess:"Ya has terminado",successProcessSub:"Pronto recibir\xe1 una notificaci\xf3n por correo para notificar la finalizaci\xf3n del proceso.",another:"\xbfEnvie otro?",listProcess:"Lista de Procesos",fileName:"Nombre del Archivo",processName:"Nombre del Proceso",language:"Lenguage",status:"Estado",quote:"Cotizar",finished:"Finalizados",inProcess:"En Proceso",paidProcess:"Proceso Pagado",processAFile:"Procesar un archivo",subProcessAFile:"Usar el servicio de procesamiento de idiomas con archivos",processing:"Procesando archivo",error:{uploadOne:"\xa1Solo puedes subir el archivo (allowedFiles)!",uploadTwo:"La imagen debe ser m\xe1s peque\xf1a que 2MB!"},rules:{process:{required:"Por favor, seleccione su proceso!"},source:{required:"Por favor seleccione su idioma de origen!"},target:{required:"Por favor seleccione su idioma de salida!"},email:{type:"El campo E-mail no es v\xe1lido!",required:"Por favor entre su E-mail!"}}},signup:{typeOfPermits:"Tipo de permisos",typeOfUser:"Tipo de usuario",typeOfUsers:{nqnp:"Sin cotizaciones y sin pago.",qnp:"Con cotizaciones y sin pago.",qp:"Con cotizaciones y con pago."},role:"Rol",password:"Contrase\xf1a",fullName:"Nombre Completo",confirm:"Confirmar contrase\xf1a",btnSignUp:"Registrarse",btnSignUpLoad:"Enviando",login:"Ingresar ahora!",or:"O",roles:{admin:"Administrador",user:"Usuario",client:"Cliente"},rules:{fullName:{required:"Por favor, este campo es requerido!"},email:{type:"El campo E-mail no es v\xe1lido!",required:"Por favor entre su E-mail!"},password:{required:"Por favor entre su Contrase\xf1a!",match:"\xa1Las dos contrase\xf1as que ingresas son inconsistentes!",confirm:"\xa1Por favor, confirme su contrase\xf1a!"}},success:"Registro completado exitosamente",error:{email:"El correo electr\xf3nico ya est\xe1 en uso",all:"Ha habido un error, por favor intente m\xe1s tarde"}},signin:{password:"Contrase\xf1a",rememberMe:"Recuerdame",btnSignIn:"Ingresar",btnSignInLoad:"Enviando",register:"registrarse ahora!",or:"O",rules:{email:{type:"El campo E-mail no es v\xe1lido!",required:"Por favor entre su E-mail!"},password:{required:"Por favor entre su Contrase\xf1a!"}},success:"Inicio de sesi\xf3n completado correctamente",error:{user:"El usuario no ha sido encontrado.",password:"La contrase\xf1a no es valida",all:"Ha habido un error, por favor intente m\xe1s tarde"}},landing:{carousel:{1:{text1:"Cum inani constituam.",text2:"Cum no congue aliquam inermis, cum quem everti cu. Ut pro wisi efficiantur, et vix paulo congue nostro.",text3:"Ut duo ullum novum legimus. At nemore verear eum."},2:{text1:"Nunc ut sapien tincidunt",text2:"Phasellus sodales dolor vitae suscipit neque ac, euismod turpis. Lorem ipsum dolor sit amet",text3:"Dis parturient montes, nascetur ridiculus mus."},3:{text1:"Quisque a lorem",text2:"Curabitur egestas, sapien vitae mattis blandit, magna ligula euismod enim, quis ultricies tortor velit eget metus.",text3:"Maecenas lectus lorem, semper id magna a, efficitur vehicula risus."},4:{text1:"Duis in suscipit felis.",text2:"Nullam laoreet eleifend feugiat. Morbi ut ultricies velit. Vivamus a commodo urna, id porttitor odio.",text3:"Sed tincidunt elementum lorem, ut dapibus lorem pulvinar et."}}}}},208:function(e,t,r){e.exports=r(395)},226:function(e,t){},232:function(e,t){},255:function(e,t,r){},256:function(e,t,r){},257:function(e,t,r){},258:function(e,t,r){},259:function(e,t,r){},260:function(e,t,r){},395:function(e,t,r){"use strict";r.r(t);var o=r(0),a=r.n(o),s=r(46),n=r(21),i=(r(213),r(162)),c=r(31),u=r(32),l=r(34),d=r(33),m=r(35),f=r(65),p=r(25),g=r(37),h=r(163),P=r.n(h),b=r(96),v=r(67),y=r(15),O=r(156),E=r.n(O),S=r(157),j=r.n(S),T=r(158),q=r(159),w=r(48);Object(v.b)([].concat(Object(b.a)(E.a),Object(b.a)(j.a)));var N={en:T,es:q},A=Object(p.c)(function(e){return{lang:e.rootReducer.auth.lang,location:e.router.location}},function(e){return{authChangeLang:Object(y.a)(w.changeLang,e)}})(function(e){var t=e.children,r=e.lang,o=e.location,s=e.authChangeLang,n="";return n+=o.pathname[1],s("en"===(n+=o.pathname[2])||"es"===n?n:r),a.a.createElement(v.a,{key:r,locale:r,messages:N[r]},t)}),C=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"componentDidUpdate",value:function(e){this.props.location!==e.location&&window.scrollTo(0,0)}},{key:"render",value:function(){return this.props.children}}]),t}(a.a.Component),I=Object(g.g)(C),x=r(64),U=r.n(x),k=r(66),L=r(164),V=r(109),D=function(e){var t=e.component,r=Object(L.a)(e,["component"]);return a.a.createElement(g.b,Object.assign({},r,{render:function(e){return null!==V.a.getToken()?a.a.createElement(t,e):a.a.createElement(g.a,{to:{pathname:"/signin",state:{from:e.location}}})}}))},M=(r(255),r(256),r(257),r(258),r(259),r(260),U()({loader:function(){return Promise.all([r.e(2),r.e(12),r.e(21)]).then(r.bind(null,626))},loading:k.a})),R=U()({loader:function(){return Promise.all([r.e(0),r.e(1),r.e(2),r.e(3),r.e(6)]).then(r.bind(null,865))},loading:k.a}),F=U()({loader:function(){return Promise.all([r.e(2),r.e(8),r.e(13)]).then(r.bind(null,866))},loading:k.a}),W=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return"/"===this.props.location.pathname?a.a.createElement(g.a,{to:"/main"}):a.a.createElement("div",{id:"app"},a.a.createElement(g.d,null,a.a.createElement(g.b,{path:"/main",component:F}),a.a.createElement(D,{path:"/dashboard",component:R}),a.a.createElement(g.b,{exact:!0,path:"/404",component:M}),a.a.createElement(g.b,{render:function(){return a.a.createElement(g.a,{to:"/404"})}})))}}]),t}(a.a.Component),z=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props,t=e.store,r=e.history;return a.a.createElement(p.a,{store:t},a.a.createElement(f.a,{history:r},a.a.createElement(i.a,{locale:P.a},a.a.createElement(A,null,a.a.createElement(I,null,a.a.createElement(g.b,{path:"/",component:W}))))))}}]),t}(o.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var H=r(118),B=r(136),X=Object(y.b)({process:H.default,auth:w.default,notification:B.default});r.d(t,"history",function(){return _});var _=Object(n.a)(),G=function(e,t){var r=y.c;return Object(y.d)(Object(y.b)({router:Object(f.b)(t),rootReducer:X,initialState:e}),r())}({},_);Object(s.render)(a.a.createElement(z,{store:G,history:_}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},48:function(e,t,r){"use strict";r.r(t),r.d(t,"fetchAuth",function(){return n}),r.d(t,"fetchUser",function(){return i}),r.d(t,"changeLang",function(){return c});var o,a=r(6),s=r(3),n=Object(s.createAction)("fetch auth",function(e){return{auth:e.auth,accessToken:e.accessToken}}),i=Object(s.createAction)("fetch user",function(e){return{user:e}}),c=Object(s.createAction)("change language",function(e){return{lang:e}});t.default=Object(s.createReducer)((o={},Object(a.a)(o,n,function(e,t){var r=t.auth,o=t.accessToken;return Object.assign({},e,{auth:r,accessToken:o})}),Object(a.a)(o,i,function(e,t){var r=t.user;return Object.assign({},e,{user:r})}),Object(a.a)(o,c,function(e,t){var r=t.lang;return Object.assign({},e,{lang:r})}),o),{auth:!1,accessToken:null,user:{},lang:"en"})},66:function(e,t,r){"use strict";var o=r(0),a=r.n(o),s=(r(166),r(101)),n=function(){return a.a.createElement(s.a,{size:"large"})};t.a=function(e){return e.error?a.a.createElement("div",{className:"loader-container"},"Error! Please refresh the page"):e.pastDelay?a.a.createElement("div",{className:"loader-container"}," ",a.a.createElement(n,null)," "):null}}},[[208,5,7]]]);
//# sourceMappingURL=main.59678866.chunk.js.map