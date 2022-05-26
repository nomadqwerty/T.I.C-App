// core modules
const fs = require('fs');
// 3rd party
const express = require('express');

// Training model
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/AppError');
const Training = require('../models/trainingModel');
const catchAsync = require('../utils/catchAsync');
const defaultController = require('./defaultController');
/////////////////////
// request handlers(Hnd)CRUD OPS
////////////
// GET req
exports.getAllTrainingsHnd = defaultController.getAll(Training);
////////////
// GET/:byParams requests
exports.getTrainingHnd = defaultController.getOne(Training);
////////////////
// POST
exports.createTrainingHnd = defaultController.createOne(Training);
///////////////
// PATCH requests
exports.updateTrainingHnd = defaultController.updateOne(Training);

///////////////
// DELETE request
exports.deleteTrainingHnd = defaultController.deleteOne(Training);

// aggregat pipelines
exports.getUpcoming = catchAsync(async (req, res, next) => {
  const day = new Date();
  const nextTraining = await Training.aggregate([
    { $unwind: '$date' },
    {
      $match: { date: { $gte: day } },
    },
    {
      $group: {
        _id: '$name',
        numTraining: { $count: {} },
      },
    },
    {
      $sort: { date: -1 },
    },
    {
      $addFields: { name: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $limit: 10,
    },
  ]);

  if (!nextTraining) {
    return next(new AppError('failed to find upcoming training', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      nextTraining,
    },
  });
});
