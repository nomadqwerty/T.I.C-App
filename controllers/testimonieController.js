// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');
const Testimonies = require('../models/testimonieModel');
const catchAsync = require('../utils/catchAsync');
const defaultController = require('./defaultController');

exports.getAllTestimoniesHnd = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Testimonies.find({ training: req.params.trainingId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const testimonies = await features.query;
  res.status(200).json({
    status: 'success',
    results: testimonies.length,
    data: {
      testimonies,
    },
  });
});
////////////////
// POST
exports.setReqparams = (req, res, next) => {
  if (!req.body.training) req.body.training = req.params.trainingId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.createTestimonieHnd = catchAsync(async (req, res, next) => {
  // let serviceName = req.body.serviceName.toLowerCase();
  // if (serviceName.includes('training')) {
  //   req.body.training = '5c88fa8cf4afda39709c2956';
  // }

  const newTestimonie = await Testimonies.create(req.body);

  if (!newTestimonie) {
    return next(new AppError('failed to create new text', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      newTestimonie,
    },
  });
});

exports.deleteTestimonie = defaultController.deleteOne(Testimonies);
