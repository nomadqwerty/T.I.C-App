const express = require('express');
const viewController = require('../controllers/viewController');
const viewRouter = express.Router();

// render overview
viewRouter.get('/overview', viewController.getOverview);
viewRouter.get('/overview1', viewController.getOverviewConference);
viewRouter.get('/', viewController.getRoot);

// render single tour
// viewRouter.get('/service', viewController.getservice);

viewRouter.route('/services/:slug').get(viewController.getservice);
viewRouter.route('/conferences/:slug').get(viewController.getconference);

module.exports = viewRouter;
