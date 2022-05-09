// 3rd party
const express = require('express');
// local module:serviceContoller required
const serviceController = require('../controllers/serviceController')

//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const serviceRouter = express.Router();

/////////////////////////////////////////////////////
// ROUTE handlers based of url paths
//////////////////////////////////////////////////////////middleware chain
// special routes
serviceRouter.route('/upcoming').get(serviceController.getUpcoming)
serviceRouter.route('/upcoming-services').get(serviceController.getAlias)

// basic crud routes
serviceRouter.route('/').get(serviceController.getAllServicesHnd).post(serviceController.createServiceHnd);
// ROUTE handlers based of url path+params
serviceRouter
  .route('/:id')
  .get(serviceController.getServiceHnd)
  .patch(serviceController.updateServicehnd)
  .delete(serviceController.deleteServiceHnd);

module.exports = serviceRouter;
