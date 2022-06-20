const express = require('express');
const viewController = require('../controllers/viewController');
const viewRouter = express.Router();
const authController = require('../controllers/authController');

// render overview
viewRouter.get('/', viewController.getRoot);
viewRouter.get('/overview-services', viewController.getOverview);
viewRouter.get('/overview-conferences', viewController.getOverviewConference);
viewRouter.get('/overview-trainings', viewController.getOverviewTraining);
viewRouter.get('/overview-departments', viewController.getOverviewDepartment);

// render single tour
// viewRouter.get('/service', viewController.getservice);

viewRouter
  .route('/services/:slug')
  .get(authController.protect, viewController.getservice);
viewRouter
  .route('/conferences/:slug')
  .get(authController.protect, viewController.getconference);
viewRouter
  .route('/trainings/:slug')
  .get(authController.protect, viewController.getTraining);
viewRouter
  .route('/departments/:slug')
  .get(authController.protect, viewController.getDepartment);
viewRouter.route('/login').get(viewController.login);
viewRouter.route('/signUp').get(viewController.signUp);

module.exports = viewRouter;
