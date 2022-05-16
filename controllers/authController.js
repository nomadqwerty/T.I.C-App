// node modules
const promisify = require('util').promisify;
const crypto = require('crypto');
// 3rd party
const express = require('express');
const jwt = require('jsonwebtoken');
// service model
const User = require('../models/userModel');
// error handler modules
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email.js');

// jwt sign function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// create and send token to user:f(n):user,statusCode,response object
const createJWTAndRes = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  // filter unwanted data fields
  // new user data
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  // error if user craetion failed
  if (!newUser) {
    next(new AppError('failed to create user', 400));
  }
  //    create JWT for auth
  // login in use with jwt
  //    return new user data
  createJWTAndRes(newUser._id, 201, res);
});

////////////login
exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email && !password) {
    return next(new AppError('please provide email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError('incorrect email and password', 401));
  }
  //    create JWT for auth
  // login in use with jwt
  createJWTAndRes(user, 200, res);
});

// protect middleware: check if user logged in
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // if no token return new Error
  if (!token) {
    return next(new AppError('you are not authorized', 401));
  }

  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError('this user no longer exists', 401));
  }
  // check if user changedpassword after jwt was issued
  let passwordWasChanged = freshUser.passwordChanged(decoded.iat);

  if (passwordWasChanged) {
    return next(
      new AppError('User currently changed password,please login again', 401)
    );
  }
  req.user = freshUser;
  // access protected routes
  next();
});

// restrict middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('you cannot perform this action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('user does not exist', 404));
  }

  const token = user.createPasswordResetToken();

  // turn off validation
  await user.save({ validateBeforeSave: false });

  // reset url for user
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/resetPassword/${token}`;

  //   message to  send by email
  const message = `Forgot password? submit a patch request with your new password and confirm to:${resetUrl}\n If not please ignore this message`;

  //   passwordResetToken:String,
  //   passwordResetExpires:Date
  try {
    //   cRraft email options
    let mailOptions = {
      email: user.email,
      subject: 'password reset token sent through email',
      message,
    };
    //   send email
    await sendEmail(mailOptions);

    //   response
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    //   reset the user fields to undefiined,
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // save
    user.save({ validateBeforeSave: false });
    // error return to global error middleware
    return next(new AppError('something went wrong please try again', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // hash token in req.params
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  // find user based of token and passExprire gte now
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gte: Date.now() },
  });
  // if no user return app error
  if (!user) {
    return next(new AppError('invalid token or token has expired', 404));
  }
  // else set password ields and confirm field
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // set token and token expire to undefined
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // save user
  await user.save();
  // send jwt
  createJWTAndRes(user, 200, res);
});

// update password:user
exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from DataBase
  const user = await User.findById(req.user._id).select('+password');

  // check req.body.password is = user.password
  let password = user.password;
  let reqPass = req.body.oldPassword;
  let compare = await user.comparePasswords(reqPass, password);

  // if correct change password
  if (compare) {
    let check = await user.comparePasswords(req.body.password, password);
    // check if user changed password
    if (check) {
      return next(new AppError('please use a new password'), 400);
    }
    // update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
  } else {
    return next(new AppError('password is incorrect', 401));
  }
  // send jwt
  createJWTAndRes(user, 200, res);
});
