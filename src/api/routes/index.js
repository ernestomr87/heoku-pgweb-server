import express from 'express';

import { checkDuplicateUserNameOrEmail } from './verifySignUp';
import { verifyToken } from './verifyJwtToken';
import { auth, configuration, process, typeOfPermits, users } from './../controllers';

const router = express.Router();


// EXTERNAL PANGEAMT
router.get('/api/engines', process.getExternalEngines);
router.post('/api/notification', process.notification);
router.post('/api/process_file', process.sendFileToExternalProcess);

//AUTH
router.post('/api/auth/signin', auth.signin);
router.post('/api/auth/signup', [checkDuplicateUserNameOrEmail], auth.signup);

//TypeOfProcesses
router.get('/api/typeOfPermits/engines', [verifyToken], process.getExternalEngines);
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
router.post('/api/process/processFileAfterQuoteFile', [verifyToken], process.processFileAfterQuoteFile);
router.post('/api/process/quoteFile', [verifyToken], process.quoteFile);

//USERS
router.get('/api/users/get/:id', [verifyToken], users.get);
router.get('/api/users/listAll', [verifyToken], users.listAll);
router.post('/api/users/create', [checkDuplicateUserNameOrEmail], [verifyToken], users.create);
router.put('/api/users/remove', [verifyToken], users.remove);
router.put('/api/users/update', [verifyToken], users.update);

//CONFIGURATION
router.get('/api/configuration', configuration.getConfiguration);
router.put('/api/paypal', configuration.setPaypal);
router.put('/api/email', configuration.setEmailNotification);

module.exports = router;
