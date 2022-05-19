// 3rd party
const express = require('express');
// local module:serviceContoller required
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const userRouter = express.Router();

userRouter.route('/signup').post(authController.signUp);
userRouter.route('/login').post(authController.login);

userRouter.route('/forgotPassword').post(authController.forgotPassword);

userRouter.route('/resetPassword/:token').patch(authController.resetPassword);

// protected user end point
userRouter
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updatePassword);

userRouter
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

userRouter
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

// ///////////////////////////////////////
userRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsersHnd
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUserHnd
  );
userRouter
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUserHnd
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUserhnd
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUserHnd
  );

module.exports = userRouter;
