const express = require('express');
const viewController = require('../controllers/viewController');
const viewRouter = express.Router();

// render overview
viewRouter.get('/', viewController.getOverview);

// render single tour
// viewRouter.get('/service', viewController.getservice);

viewRouter.route('/services/:name').get(viewController.getservice);

module.exports = viewRouter;
