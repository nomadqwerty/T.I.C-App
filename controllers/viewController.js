// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const Testimonie = require('../models/testimonieModel');
const Service = require('../models/serviceModel');

const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const services = await Service.find();
  res.status(200).render('overview', {
    title: 'All services',
    services,
  });
});

exports.getservice = catchAsync(async (req, res, next) => {
  const service = await Service.findOne({ name: req.params.name });

  // pass into
  res.status(200).render('service', {
    title: service.name,
    service,
  });
});
