// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const Conference = require('../models/conferenceModel');
const catchAsync = require('../utils/catchAsync');
const defaultController = require('./defaultController');
/////////////////////
// request handlers(Hnd)CRUD OPS
////////////
// GET req
exports.getAllConferencesHnd = defaultController.getAll(Conference);

////////////
// GET/:byParams requests
exports.getConferenceHnd = defaultController.getOne(Conference);
////////////////
// POST
exports.createConferenceHnd = defaultController.createOne(Conference);
///////////////
// PATCH requests
exports.updateConferencehnd = defaultController.updateOne(Conference);
///////////////
// DELETE request
exports.deleteConferenceHnd = defaultController.deleteOne(Conference);
// controllers for aggregation pipline
exports.getUpcoming = catchAsync(async (req, res, next) => {
  const day = new Date();
  const monthConf = await Conference.aggregate([
    { $unwind: '$date' },
    {
      $match: { date: { $lte: day } },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$date' },
        numConf: { $count: {} },
        conferences: { $push: '$name' },
      },
    },
  ]);

  if (!monthConf) {
    return next(new AppError("failed to find this month's conference", 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      monthConf,
    },
  });
});
