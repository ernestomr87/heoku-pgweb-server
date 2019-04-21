"use strict";

var _express = _interopRequireDefault(require("express"));

var _verifySignUp = require("./verifySignUp");

var _verifyJwtToken = require("./verifyJwtToken");

var _controllers = require("./../controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // EXTERNAL PANGEAMT


router.get('/api/engines', _controllers.process.getExternalEngines);
router.post('/api/notification', _controllers.process.notification);
router.post('/api/process_file', _controllers.process.sendFileToExternalProcess); //AUTH

router.post('/api/auth/signin', _controllers.auth.signin);
router.post('/api/auth/signup', [_verifySignUp.checkDuplicateUserNameOrEmail], _controllers.auth.signup); //TypeOfProcesses

router.get('/api/typeOfPermits/engines', [_verifyJwtToken.verifyToken], _controllers.process.getExternalEngines);
router.get('/api/typeOfPermits/list', [_verifyJwtToken.verifyToken], _controllers.typeOfPermits.list);
router.post('/api/typeOfPermits/add', [_verifyJwtToken.verifyToken], _controllers.typeOfPermits.add);
router.put('/api/typeOfPermits/default', [_verifyJwtToken.verifyToken], _controllers.typeOfPermits["default"]);
router.put('/api/typeOfPermits/edit', [_verifyJwtToken.verifyToken], _controllers.typeOfPermits.edit);
router.put('/api/typeOfPermits/remove', [_verifyJwtToken.verifyToken], _controllers.typeOfPermits.remove); //Process

router.get('/api/process/:uuid', _controllers.process.getProcessByUuid);
router.get('/api/process/process', [_verifyJwtToken.verifyToken], _controllers.process.getProcess);
router.get('/api/process/user', [_verifyJwtToken.verifyToken], _controllers.auth.userContent);
router.post('/api/process/processFile', [_verifyJwtToken.verifyToken], _controllers.process.processFile);
router.post('/api/process/processFileAfterQuoteFile', [_verifyJwtToken.verifyToken], _controllers.process.processFileAfterQuoteFile);
router.post('/api/process/quoteFile', [_verifyJwtToken.verifyToken], _controllers.process.quoteFile); //USERS

router.get('/api/users/get/:id', [_verifyJwtToken.verifyToken], _controllers.users.get);
router.get('/api/users/listAll', [_verifyJwtToken.verifyToken], _controllers.users.listAll);
router.post('/api/users/create', [_verifySignUp.checkDuplicateUserNameOrEmail], [_verifyJwtToken.verifyToken], _controllers.users.create);
router.put('/api/users/remove', [_verifyJwtToken.verifyToken], _controllers.users.remove);
router.put('/api/users/update', [_verifyJwtToken.verifyToken], _controllers.users.update); //CONFIGURATION

router.get('/api/configuration', _controllers.configuration.getConfiguration);
router.put('/api/paypal', _controllers.configuration.setPaypal);
router.put('/api/email', _controllers.configuration.setEmailNotification);
module.exports = router;