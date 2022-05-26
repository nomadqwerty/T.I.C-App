// 3rd party
const express = require('express');

// service model
const Service = require('../models/serviceModel');
const ApiFeatures = require('../utils/ApiFeatures');

// error handler modules
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const defaultController = require('./defaultController');

////////////:request handlers(Hnd)CRUD OPS
// GET req
exports.getAllServicesHnd = defaultController.getAll(Service);

// GET/:byParams requests
exports.getServiceHnd = defaultController.getOne(Service);

// POST
exports.createServiceHnd = defaultController.createOne(Service);

// PATCH requests
exports.updateServicehnd = defaultController.updateOne(Service);

// DELETE request
exports.deleteServiceHnd = defaultController.deleteOne(Service);

// controllers for agregation pipelines

exports.getUpcoming = catchAsync(async (req, res, next) => {
  let thisMoment = new Date().getDay();
  if (thisMoment === 6) thisMoment = 0;

  const nextService = await Service.aggregate([
    {
      $match: { dateIndex: { $gte: thisMoment } },
    },
    {
      $group: {
        _id: '$name',
        numServices: { $count: {} },
      },
    },
    {
      $sort: { dateIndex: -1 },
    },
    {
      $addFields: { name: '$_id' },
    },
    {
      $project: { numServices: 0, _id: 0 },
    },
    {
      $limit: 10,
    },
  ]);

  if (!nextService) {
    return next(new AppError('can not find services!!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      nextService,
    },
  });
});

// alias middleware
exports.getAlias = catchAsync(async (req, res, next) => {
  let thisMoment = new Date().getDay();
  if (thisMoment === 6) thisMoment = 0;

  const nextService = await Service.find({ dateIndex: { $gte: thisMoment } });

  if (!nextService) {
    return next(new AppError('can not find services!!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      nextService,
    },
  });
});
