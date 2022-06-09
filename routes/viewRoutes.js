const express = require('express');
const viewController = require('../controllers/viewController');
const viewRouter = express.Router();

// render overview
viewRouter.get('/', viewController.getRoot);
viewRouter.get('/overview-services', viewController.getOverview);
viewRouter.get('/overview-conferences', viewController.getOverviewConference);
viewRouter.get('/overview-trainings', viewController.getOverviewTraining);

// render single tour
// viewRouter.get('/service', viewController.getservice);

viewRouter.route('/services/:slug').get(viewController.getservice);
viewRouter.route('/conferences/:slug').get(viewController.getconference);
viewRouter.route('/trainings/:slug').get(viewController.getTraining);

module.exports = viewRouter;
