// 3rd party
const express = require('express');
// service model
const User = require('../models/userModel');
// error handler modules
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

////////////////////////////////////////////////////////////
const filteredBody = (obj, fields) => {
  // new object
  newObj = {};
  Object.keys(obj).forEach((key) => {
    if (fields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

// userhandler functions
////////////
// GET req
exports.getAllUsersHnd = catchAsync(async (req, res) => {
  const users = await User.find().select('+active');

  res.status(200).json({
    // jsend format
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

////////////
// GET/:byParams requests
exports.getUserHnd = (req, res) => {
  res.status(500).json({
    // jsend format
    status: 'error',
    requestedAt: req.requestTime,
    message: 'notyet defined',
  });
};

////////////////
// POST
exports.createUserHnd = (req, res) => {
  res.status(500).json({
    // jsend format
    status: 'error',
    requestedAt: req.requestTime,
    message: 'notyet defined',
  });
};

///////////////
// PATCH requests
exports.updateUserhnd = (req, res) => {
  res.status(500).json({
    // jsend format
    status: 'error',
    requestedAt: req.requestTime,
    message: 'notyet defined',
  });
};

///////////////
// update user
exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if user sends a password in req payload
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('to update , use: /updatePassword', 400));
  }
  // update user doc:find userby id(id,fields,{new:,runValidators:})
  let newObj = filteredBody(req.body, ['email', 'name']);

  const user = await User.findByIdAndUpdate(req.user._id, newObj, {
    // return the newly updated doc
    new: true,
    // validate input
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

///////////////
// DELETE request
exports.deleteUserHnd = (req, res) => {
  res.status(500).json({
    // jsend format
    status: 'error',
    requestedAt: req.requestTime,
    message: 'notyet defined',
  });
};

////////////////////
//////delete user account
// delete f(n){ find user by id({active:flase})}
// add model middle,pre hooks on find-query
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  // req.headers.authorization = undefined;

  res.status(204).json({
    status: 'success',
  });
});
