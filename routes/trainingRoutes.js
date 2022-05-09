// 3rd party
const express = require('express');
// local module:serviceContoller required
const trainingController = require('../controllers/trainingController')

//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const trainingRouter = express.Router();


////////////aggregate pip routes
trainingRouter.route('/upcoming-training').get(trainingController.getUpcoming)

////////////
// ROUTE handlers based of url paths

trainingRouter.route('/').get(trainingController.getAllTrainingsHnd).post(trainingController.createTrainingHnd);
// ROUTE handlers based of url path+params
trainingRouter
  .route('/:id')
  .get(trainingController.getTrainingHnd)
  .patch(trainingController.updateTrainingHnd)
  .delete(trainingController.deleteTrainingHnd);

module.exports = trainingRouter;
