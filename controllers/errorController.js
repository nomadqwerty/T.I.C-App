const AppError = require('../utils/AppError');

// handle mongodb error
const handleCastError = (err) => {
  const message = `invalid ${err.path},:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const message = `${err.keyValue.name} already exists`;
  return new AppError(message, 400);
};

const handleValidatorError = (err) => {
  let errors = Object.values(err.errors)
    .map((err) => err.properties.message)
    .join('. ');
  return new AppError(errors, 400);
};

const handleJsonWebTokenError = (err) => {
  return new AppError('you are not authorized', 401);
};
const handleJsonWebTokenErrorExpired = (err) => {
  return new AppError('session has expired,please login again', 401);
};

// send: dev error
const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

// send: prod error
const prodError = (err, res) => {
  // if error is operational- user errors
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // if error is unkwown, not operational.
    // send generic error
    res.status(500).json({
      status: 'ERROR',
      message: 'Something went wrong!!!',
    });
  }
};

// error middle ware controller
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = error.name || err.name;
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.name === 'ValidationError') error = handleValidatorError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJsonWebTokenErrorExpired(error);

    prodError(error, res);
  }
  next();
};
