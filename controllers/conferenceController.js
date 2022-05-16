// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');
const Conference = require('../models/conferenceModel');
const catchAsync = require('../utils/catchAsync');
/////////////////////
// request handlers(Hnd)CRUD OPS
////////////
// GET req
exports.getAllConferencesHnd = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Conference.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const conferences = await features.query;
  res.status(200).json({
    status: 'success',
    results: conferences.length,
    data: {
      conferences,
    },
  });
});

////////////
// GET/:byParams requests
exports.getConferenceHnd = catchAsync(async (req, res, next) => {
  const conference = await Conference.findById(req.params.id);

  if (!conference) {
    return next(new AppError('no conference found', 404));
  }

  res.status(200).json({
    // jsend format
    status: 'success',
    data: {
      conference,
    },
  });
});

////////////////
// POST
exports.createConferenceHnd = catchAsync(async (req, res, next) => {
  const newConference = await Conference.create(req.body);

  if (!newConference) {
    return next(new AppError('failed to create new conference', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      newConference,
    },
  });
});

///////////////
// PATCH requests
exports.updateConferencehnd = catchAsync(async (req, res, next) => {
  const conference = await Conference.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!conference) {
    return next(new AppError('failed to update conference', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      conference,
    },
  });
});

///////////////
// DELETE request
exports.deleteConferenceHnd = catchAsync(async (req, res, next) => {
  const conference = await Conference.findByIdAndDelete(req.params.id);

  if (!conference) {
    return next(new AppError('failed to delete conference', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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
