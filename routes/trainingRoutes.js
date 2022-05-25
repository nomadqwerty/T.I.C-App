// 3rd party
const express = require('express');
// local module:serviceContoller required
const trainingController = require('../controllers/trainingController');
const authController = require('../controllers/authController');
const testimonieRouter = require('./testimonieRoutes');
//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const trainingRouter = express.Router();

// merge params
trainingRouter.use('/:trainingId/testimonie', testimonieRouter);
////////////aggregate pip routes
trainingRouter.route('/upcoming-training').get(trainingController.getUpcoming);

////////////
// ROUTE handlers based of url paths

trainingRouter
  .route('/')
  .get(trainingController.getAllTrainingsHnd)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    trainingController.createTrainingHnd
  );
// ROUTE handlers based of url path+params
trainingRouter
  .route('/:id')
  .get(trainingController.getTrainingHnd)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    trainingController.updateTrainingHnd
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    trainingController.deleteTrainingHnd
  );

// nested routes

module.exports = trainingRouter;
