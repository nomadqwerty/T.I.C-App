// 3rd party
const express = require('express');
// local module:serviceContoller required
const testimonieController = require('../controllers/testimonieController');
const authController = require('../controllers/authController');

//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const testRouter = express.Router();

testRouter
  .route('/')
  .get(testimonieController.getAllTestimoniesHnd)
  .post(authController.protect, testimonieController.createTestimonieHnd);
module.exports = testRouter;
