import express from 'express'

import userController from '../controllers/userController'

const router = express.Router();

router.post('/insertUsersIfNoneFound', userController.addBulkUser);

router.post('/addUser', userController.addUser);

router.post('/editUser', userController.editUser);

router.post('/deleteUser', userController.deleteUser);

export default router
