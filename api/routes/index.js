let express = require("express");
let verifySignUp = require("./verifySignUp");
let verifyJwtToken = require("./verifyJwtToken");
let controllers = require("./../controllers");

let checkDuplicateUserNameOrEmail = verifySignUp.checkDuplicateUserNameOrEmail;
let verifyToken = verifyJwtToken.verifyToken;
let isAdmin = verifyJwtToken.isAdmin;
let isUser = verifyJwtToken.isUser;
let isClient = verifyJwtToken.isClient;
let isAdminIsCLient = verifyJwtToken.isAdminIsCLient;

let auth = controllers.auth;
let configuration = controllers.configuration;
let process = controllers.process;
let typeOfPermits = controllers.typeOfPermits;
let users = controllers.users;
let billing = controllers.billing;
let nodes = controllers.nodes;
let models = controllers.models;
let eds = controllers.eds;
let engines = controllers.engines;

const router = express.Router();

// EXTERNAL PANGEAMT
router.get("/api/engines", process.getExternalEngines);
router.get("/api/engines/user", [verifyToken, isUser], process.enginesByUser);
router.get("/api/engines/load", [verifyToken, isAdmin], process.load);
router.post("/api/notification", process.notification);
router.delete(
  "/api/notification",
  [verifyToken, isUser],
  process.clearNotification
);
router.post("/api/process_file", process.sendFileToExternalProcess);

//AUTH
router.post("/api/auth/signin", auth.signin);
router.post("/api/auth/signup", [checkDuplicateUserNameOrEmail], auth.signup);

//TypeOfProcesses
router.get(
  "/api/typeOfPermits/engines",
  [verifyToken],
  process.getExternalEngines
);
router.get("/api/typeOfPermits/list", [verifyToken], typeOfPermits.list);
router.post("/api/typeOfPermits/add", [verifyToken], typeOfPermits.add);
router.put("/api/typeOfPermits/default", [verifyToken], typeOfPermits.default);
router.put("/api/typeOfPermits/edit", [verifyToken], typeOfPermits.edit);
router.put("/api/typeOfPermits/remove", [verifyToken], typeOfPermits.remove);

//Process
router.get("/api/process/getProcessByListId", process.getProcessByListId);
router.get("/api/process/process", [verifyToken], process.getProcess);
router.get("/api/process/user", [verifyToken], auth.userContent);
router.get("/api/process/:uuid", process.getProcessByUuid);
router.post("/api/process/processFile", [verifyToken], process.quoteFile);
router.post("/api/process/quoteFile", [verifyToken], process.quoteFile);
router.post(
  "/api/process/processFileAfterQuoteFile",
  [verifyToken],
  process.processFileAfterQuoteFile
);
router.put("/api/process/downloaded", [verifyToken], process.setDownload);
router.put("/api/process/removed", [verifyToken], process.removed);

//USERS
router.get("/api/users/get/:id", [verifyToken], users.get);
router.get("/api/users/listAll", [verifyToken], users.listAll);
router.post(
  "/api/users/create",
  [checkDuplicateUserNameOrEmail],
  [verifyToken],
  users.create
);
router.put("/api/users/remove", [verifyToken], users.remove);
router.put("/api/users/update", [verifyToken], users.update);
router.put("/api/users/profile", [verifyToken], users.profile);
router.put("/api/users/password", [verifyToken], users.password);

router.get(
  "/api/users/dashboard/user",
  [verifyToken, isUser],
  users.userDashboard
);

router.get(
  "/api/users/dashboard/client",
  [verifyToken, isClient],
  users.clientDashboard
);

router.get(
  "/api/users/dashboard/admin",
  [verifyToken, isAdmin],
  users.adminDashboard
);

router.post(
  "/api/users/dashboard/user",
  [verifyToken, isAdminIsCLient],
  users.ownerUserDashboard
);
router.post(
  "/api/users/dashboard/client",
  [verifyToken, isAdmin],
  users.ownerClientDashboard
);

//CONFIGURATION
router.get("/api/configuration", configuration.getConfiguration);
router.put("/api/paypal", configuration.setPaypal);
router.put("/api/email", configuration.setEmailNotification);

//BILLING INFO
router.get("/api/billing", [verifyToken], billing.get);
router.post("/api/billing", [verifyToken], billing.add);
router.put("/api/billing", [verifyToken], billing.edit);

//PAYMENTS
router.post("/api/payment/pay", process.pay);
router.post("/api/payment/register/pay", [verifyToken], process.pay);
router.get("/api/payment/:uuid/:quote/return", process.return);
router.get("/api/payment/:uuid/cancel", process.cancel);
router.get("/api/payment/:uuid/:quote/return_free", process.return_free);
router.get("/api/payment/:uuid/cancel_free", process.cancel_free);

//GET NODES
router.get("/api/corp/nodes", [verifyToken, isAdmin], nodes.getNodes);
router.post("/api/corp/nodes", [verifyToken, isAdmin], nodes.addNode);
router.delete("/api/corp/nodes", [verifyToken, isAdmin], nodes.delNode);
router.put(
  "/api/corp/nodes/restart",
  [verifyToken, isAdmin],
  nodes.restartNode
);
router.put(
  "/api/corp/nodes/enabled",
  [verifyToken, isAdmin],
  nodes.enabledNode
);
router.put(
  "/api/corp/nodes/disabled",
  [verifyToken, isAdmin],
  nodes.disabledNode
);

//MODELS
router.get("/api/corp/models", [verifyToken, isAdmin], models.getModels);
router.post("/api/corp/models", [verifyToken, isAdmin], models.addModel);
router.put("/api/corp/models", [verifyToken, isAdmin], models.cloneModel);
router.delete("/api/corp/models", [verifyToken, isAdmin], models.delModel);

//EDS
router.get("/api/corp/eds", [verifyToken, isAdmin], eds.getEds);
router.post("/api/corp/eds", [verifyToken, isAdmin], eds.addEd);
router.delete("/api/corp/eds", [verifyToken, isAdmin], eds.delEd);
router.put("/api/corp/eds/enabled", [verifyToken, isAdmin], eds.enabledEd);
router.put("/api/corp/eds/disabled", [verifyToken, isAdmin], eds.disabledEd);

//SERVICES
router.get(
  "/api/corp/services",
  [verifyToken, isAdminIsCLient],
  engines.getServices
);

//ENGINES
router.get(
  "/api/corp/engines",
  [verifyToken, isAdminIsCLient],
  engines.getEngines
);
router.post("/api/corp/engines", [verifyToken, isAdmin], engines.addEngine);
router.delete("/api/corp/engines", [verifyToken, isAdmin], engines.delEngine);
router.put(
  "/api/corp/engines/enabled",
  [verifyToken, isAdmin],
  engines.enabledEngine
);
router.put(
  "/api/corp/engines/disabled",
  [verifyToken, isAdmin],
  engines.disabledEngine
);
router.post(
  "/api/corp/engines/grantAll",
  [verifyToken, isClient],
  engines.updateClientEngine
);

router.get(
  "/api/corp/engines/users/:id",
  [verifyToken, isAdminIsCLient],
  engines.enginesByUser
);
router.post(
  "/api/corp/engines/users",
  [verifyToken, isAdminIsCLient],
  engines.addUserEngine
);
router.put(
  "/api/corp/engines/users",
  [verifyToken, isAdminIsCLient],
  engines.delUserEngine
);

//ENGINES_USERS
router.post("/api/users/corp", users.listCorp);
router.post("/api/getStats", [verifyToken], process.getStats);

module.exports = router;
