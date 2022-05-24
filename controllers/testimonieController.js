// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');
const Testimonies = require('../models/testimonieModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllTestimoniesHnd = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Testimonies.find(), req.query)
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
exports.createTestimonieHnd = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  let serviceName = req.body.serviceName.toLowerCase();
  if (serviceName.includes('training')) {
    req.body.training = '5c88fa8cf4afda39709c2956';
  }

  const newTestimonie = await Testimonies.create(req.body);
  console.log(req.body);

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
