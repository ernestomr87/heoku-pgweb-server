var express = require('express');
var router = express.Router();

const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

var controllers = require('../controllers');
var mailer = require('./../util/mailer');

var process = controllers.process;
var auth = controllers.auth;
var users = controllers.users;
var typeOfPermits = controllers.typeOfPermits;

//  REST-API

// EXTERNAL PANGEAMT
router.get('/api/engines', process.getExternalEngines);
router.post('/api/process_file', process.sendFileToExternalProcess);
router.post('/api/notification', process.notification);

//AUTH
router.post(
  '/api/auth/signup',
  [verifySignUp.checkDuplicateUserNameOrEmail],
  auth.signup
);
router.post('/api/auth/signin', auth.signin);

//TypeOfProcesses
router.get(
  '/api/typeOfPermits/list',
  [authJwt.verifyToken],
  typeOfPermits.list
);
router.post('/api/typeOfPermits/add', [authJwt.verifyToken], typeOfPermits.add);
router.put(
  '/api/typeOfPermits/edit',
  [authJwt.verifyToken],
  typeOfPermits.edit
);
router.put(
  '/api/typeOfPermits/remove',
  [authJwt.verifyToken],
  typeOfPermits.remove
);
router.put(
  '/api/typeOfPermits/default',
  [authJwt.verifyToken],
  typeOfPermits.default
);
router.get(
  '/api/typeOfPermits/engines',
  [authJwt.verifyToken],
  process.getExternalEngines
);

//Process
router.get('/api/process/user', [authJwt.verifyToken], auth.userContent);
router.get('/api/process/:uuid', process.getProcessByUuid);
router.post(
  '/api/process/processFile',
  [authJwt.verifyToken],
  process.processFile
);
router.post('/api/process/quoteFile', [authJwt.verifyToken], process.quoteFile);
router.post(
  '/api/process/processFileAfterQuoteFile',
  [authJwt.verifyToken],
  process.processFileAfterQuoteFile
);
router.get('/api/process/process', [authJwt.verifyToken], process.getProcess);
router.get('/api/process/process', [authJwt.verifyToken], process.getProcess);

//USERS
router.get('/api/users/listAll', [authJwt.verifyToken], users.listAll);
router.get('/api/users/get/:id', [authJwt.verifyToken], users.get);
router.post(
  '/api/users/create',
  [verifySignUp.checkDuplicateUserNameOrEmail],
  [authJwt.verifyToken],
  users.create
);
router.put('/api/users/remove', [authJwt.verifyToken], users.remove);
router.put('/api/users/update', [authJwt.verifyToken], users.update);

router.get('/api/email', mailer.main);

module.exports = router;
