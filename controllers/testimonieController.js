// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const Testimonie = require('../models/testimonieModel');
const catchAsync = require('../utils/catchAsync');
const defaultController = require('./defaultController');

////////////////
// GET>:read
exports.getAllTestimoniesHnd = defaultController.getAll(Testimonie);
exports.getTestimonieHnd = defaultController.getOne(Testimonie);
////////////////
// POST>:create
exports.setReqparams = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.createTestimonieHnd = defaultController.createOne(Testimonie);
////////////////
// PATCH>:update
exports.updateTestimonieHnd = defaultController.updateOne(Testimonie);

////////////////
// DELETE>:delete
exports.deleteTestimonieHnd = defaultController.deleteOne(Testimonie);
