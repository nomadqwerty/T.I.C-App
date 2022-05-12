// 3rd party
const express = require('express');
// local module:serviceContoller required
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const userRouter = express.Router();

userRouter.route('/signup').post(authController.signUp)
userRouter.route('/login').post(authController.login)

userRouter.route('/forgotPassword').post(authController.forgotPassword)

userRouter.route('/resetPassword/:token').patch(authController.forgotPassword)

// ///////////////////////////////////////
userRouter.route('/').get(userController.getAllUsersHnd).post(userController.createUserHnd);
userRouter
  .route('/:id')
  .get(userController.getUserHnd)
  .patch(userController.updateUserhnd)
  .delete(userController.deleteUserHnd);

module.exports = userRouter;
