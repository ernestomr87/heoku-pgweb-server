var express = require('express');
var router = express.Router();

const checkDuplicateUserNameOrEmail = require('./verifySignUp').checkDuplicateUserNameOrEmail;
const verifyToken = require('./verifyJwtToken').verifyToken;

var controllers = require('../controllers');
var mailer = require('./../util/mailer');

var auth = controllers.auth;
var process = controllers.process;
var typeOfPermits = controllers.typeOfPermits;
var users = controllers.users;

//  REST-API

// EXTERNAL PANGEAMT
router.get('/api/engines', process.getExternalEngines);
router.post('/api/notification', process.notification);
router.post('/api/process_file', process.sendFileToExternalProcess);

//AUTH
router.post('/api/auth/signin', auth.signin);
router.post('/api/auth/signup', [checkDuplicateUserNameOrEmail], auth.signup);

//TypeOfProcesses
router.get('/api/typeOfPermits/engines', [verifyToken],process.getExternalEngines);
router.get('/api/typeOfPermits/list', [verifyToken], typeOfPermits.list);
router.post('/api/typeOfPermits/add', [verifyToken], typeOfPermits.add);
router.put('/api/typeOfPermits/default', [verifyToken], typeOfPermits.default);
router.put('/api/typeOfPermits/edit', [verifyToken], typeOfPermits.edit);
router.put('/api/typeOfPermits/remove', [verifyToken], typeOfPermits.remove);

//Process
router.get('/api/process/:uuid', process.getProcessByUuid);
router.get('/api/process/process', [verifyToken], process.getProcess);
router.get('/api/process/user', [verifyToken], auth.userContent);
router.post('/api/process/processFile', [verifyToken], process.processFile);
router.post('/api/process/processFileAfterQuoteFile', [verifyToken],process.processFileAfterQuoteFile);
router.post('/api/process/quoteFile', [verifyToken], process.quoteFile);

//USERS
router.get('/api/email', mailer.main);
router.get('/api/users/get/:id', [verifyToken], users.get);
router.get('/api/users/listAll', [verifyToken], users.listAll);
router.post('/api/users/create', [checkDuplicateUserNameOrEmail],[verifyToken],users.create);
router.put('/api/users/remove', [verifyToken], users.remove);
router.put('/api/users/update', [verifyToken], users.update);

module.exports = router;
