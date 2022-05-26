// 3rd party
const express = require('express');

// department model
const Department = require('../models/departmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const defaultController = require('./defaultController');

/////////////////////
// request handlers(Hnd)CRUD OPS
////////////
// GET req
exports.getAllDepartmentsHnd = defaultController.getAll(Department);
////////////
// GET/:byParams requests
exports.getDepartmentHnd = defaultController.getOne(Department);

////////////////
// POST
exports.createDepartmentHnd = defaultController.createOne(Department);

///////////////
// PATCH requests
exports.updateDepartmentHnd = defaultController.updateOne(Department);

///////////////
// DELETE request
exports.deleteDepartmentHnd = defaultController.deleteOne(Department);

//////////////////////////////////////////////////////////////////////////////////
// aggregation pipeline
exports.getNextMeeting = catchAsync(async (req, res, next) => {
  let thisMoment = new Date().getDay();

  const nextMeeting = await Department.aggregate([
    {
      $match: { meetingDays: { $lte: thisMoment } },
    },
    {
      $project: {
        _id: 0,
        zoomId: 0,
        facebookPage: 0,
        images: 0,
        createdAt: 0,
        imageCover: 0,
        __v: 0,
      },
    },
  ]);

  if (!nextMeeting) {
    return next(new AppError('failed to find meeting', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      nextMeeting,
    },
  });
});
