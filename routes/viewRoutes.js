const express = require('express');
const viewController = require('../controllers/viewController');
const viewRouter = express.Router();
const authController = require('../controllers/authController');

// render overview

// Isioma // -> I added your authController.isLoggedIn function here before the getRoot to always check if your logged in or not before getting the root component
viewRouter.get('/', authController.isLoggedin, viewController.getRoot);
// Isioma //


viewRouter.get('/overview-services', viewController.getOverview);
viewRouter.get('/overview-conferences', viewController.getOverviewConference);
viewRouter.get('/overview-trainings', viewController.getOverviewTraining);
viewRouter.get('/overview-departments', viewController.getOverviewDepartment);

// render single tour
// viewRouter.get('/service', viewController.getservice);

// viewRouter.use(authController.isLoggedin);

viewRouter.route('/services/:slug').get(authController.isLoggedin, viewController.getservice);
viewRouter.route('/conferences/:slug').get(authController.isLoggedin, viewController.getconference);
viewRouter.route('/trainings/:slug').get(authController.isLoggedin, viewController.getTraining);
viewRouter.route('/departments/:slug').get(authController.isLoggedin, viewController.getDepartment);

// Isioma //
viewRouter.route('/login').get(viewController.login).post(viewController.postLogin, viewController.getRoot);
// Isioma //

viewRouter.route('/signUp').get(viewController.signUp);

module.exports = viewRouter;
