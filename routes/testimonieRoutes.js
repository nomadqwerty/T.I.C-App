// 3rd party
const express = require('express');
// local module:serviceContoller required
const testimonieController = require('../controllers/testimonieController');
const authController = require('../controllers/authController');

//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const testRouter = express.Router({ mergeParams: true });

testRouter
  .route('/')
  .get(testimonieController.getAllTestimoniesHnd)
  .post(
    authController.protect,
    testimonieController.setReqparams,
    testimonieController.createTestimonieHnd
  );

testRouter
  .route('/:id')
  .get(testimonieController.getTestimonieHnd)
  .patch(authController.protect, testimonieController.updateTestimonieHnd)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    testimonieController.deleteTestimonieHnd
  );
module.exports = testRouter;
