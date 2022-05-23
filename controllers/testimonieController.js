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
  req.body.user = req.user;
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
