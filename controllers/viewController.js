// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const Testimonie = require('../models/testimonieModel');
const Service = require('../models/serviceModel');

const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const services = await Service.find();
  console.log(services[0]);
  res.status(200).render('overview', {
    title: 'All services',
    services,
  });
});

exports.getservice = (req, res, next) => {
  res.status(200).render('service', {
    title: 'Impact Sunday Service',
  });
};
