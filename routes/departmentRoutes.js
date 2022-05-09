// 3rd party
const express = require('express');
// local module:serviceContoller required
const deparmentController = require('../controllers/departmentsController')

//////////////////////////////////////////////////////////////////////
//create instance of Router() Object
const departmentRouter = express.Router();


// aggregate route 
departmentRouter.route('/next-meeting').get(deparmentController.getNextMeeting)

// ROUTE handlers based of url paths

departmentRouter.route('/').get(deparmentController.getAllDepartmentsHnd).post(deparmentController.createDepartmentHnd);
// ROUTE handlers based of url path+params
departmentRouter
  .route('/:id')
  .get(deparmentController.getDepartmentHnd)
  .patch(deparmentController.updateDepartmentHnd)
  .delete(deparmentController.deleteDepartmentHnd);

module.exports = departmentRouter;
