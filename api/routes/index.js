let express = require("express");
let verifySignUp = require("./verifySignUp");
let verifyJwtToken = require("./verifyJwtToken");
let controllers = require("./../controllers");

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

let checkDuplicateUserNameOrEmail = verifySignUp.checkDuplicateUserNameOrEmail;
let verifyToken = verifyJwtToken.verifyToken;
let isAdmin = verifyJwtToken.isAdmin;
let isUser = verifyJwtToken.isUser;

let auth = controllers.auth;
let configuration = controllers.configuration;
let process = controllers.process;
let typeOfPermits = controllers.typeOfPermits;
let users = controllers.users;
let dashboard = controllers.dashboard;

const router = express.Router();

// DASHBOARD
router.get("/api/dashboard", dashboard.get);

// EXTERNAL PANGEAMT
router.get("/api/engines", process.getExternalEngines);
router.get("/api/engines/load", [verifyToken, isAdmin], process.load);
router.post("/api/notification", process.notification);
router.delete(
  "/api/notification",
  [verifyToken, isUser],
  process.clearNotification
);
router.post(
  "/api/process_file",
  upload.single("file"),
  process.sendFileToExternalProcess
);

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
router.get("/api/process/process", [verifyToken], process.getProcess);
router.get("/api/process/user", [verifyToken], auth.userContent);
router.get("/api/process/:uuid", process.getProcessByUuid);
router.post("/api/process/processFile", [verifyToken], process.processFile);
router.post("/api/process/quoteFile", [verifyToken], process.quoteFile);
router.post(
  "/api/process/processFileAfterQuoteFile",
  [verifyToken],
  process.processFileAfterQuoteFile
);

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

//CONFIGURATION
router.get("/api/configuration", configuration.getConfiguration);
router.put("/api/paypal", configuration.setPaypal);
router.put("/api/email", configuration.setEmailNotification);

router.get("/api/pay", process.pay);
router.put("/api/cancel", process.cancel);

// router.post('/api/email', mailer.main('ernestomr87@gmail.com',''));

module.exports = router;
