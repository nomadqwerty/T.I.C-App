// 3rd party
const express = require('express');
// service model
const User = require('../models/userModel')
// error handler modules
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')

////////////////////////////////////////////////////////////
// user routes
// userhandler functions
////////////
// GET req
exports.getAllUsersHnd = catchAsync(async (req, res) => {
    const users = await User.find()

    res.status(200).json({
      // jsend format
      status: 'success',
      requestedAt: req.requestTime,
      results: users.length,
      data:{
        users
      }
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
// DELETE request
exports.deleteUserHnd = (req, res) => {
    res.status(500).json({
      // jsend format
      status: 'error',
      requestedAt: req.requestTime,
      message: 'notyet defined',
    });
};
  