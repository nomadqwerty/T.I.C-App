// 3rd party
const express = require('express');
// local module:serviceContoller required
const conferenceController = require('../controllers/conferenceController')
const authController = require('../controllers/authController')

//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const conferenceRouter = express.Router();

/////////////////////////////////////////////////////
// ROUTE handlers based of url paths
//////////////////////////////////////////////////////////middleware chain
// special routes
conferenceRouter.route('/upcoming-conferences').get(conferenceController.getUpcoming)

// crud routes
conferenceRouter.route('/').get(authController.protect,conferenceController.getAllConferencesHnd).post(conferenceController.createConferenceHnd);
// ROUTE handlers based of url path+params
conferenceRouter
  .route('/:id')
  .get(conferenceController.getConferenceHnd)
  .patch(conferenceController.updateConferencehnd)
  .delete(authController.protect,authController.restrictTo('admin','lead-pastor'),conferenceController.deleteConferenceHnd);

module.exports = conferenceRouter;
