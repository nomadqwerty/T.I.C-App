// 3rd party modules
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
// AppError class:A_E
const AppError = require('./utils/AppError');
// error contoller function
const globalErrorHandler = require('./controllers/errorController');

// require user and service Routes modules
const serviceRouter = require('./routes/serviceRoutes');
const testimonieRouter = require('./routes/testimonieRoutes');
const trainingRouter = require('./routes/trainingRoutes');
const departmentRouter = require('./routes/departmentRoutes');
const conferenceRouter = require('./routes/conferenceRoutes');
const userRouter = require('./routes/userRoutes');
// instance of the express module
const app = express();

// GLOBAL MIDDLEWARE
// secure http headers with helmet
app.use(helmet());

// logger middlerware
if (process.env.NODE_ENV === 'developement') {
  // 3rd party middleware:logger
  app.use(morgan('dev'));
}
// express middleware:body parser read data from request
app.use(express.json({ limit: '25kb' }));
// midleware for req time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// ratelimiting for bruteforce&dos: ratelimit options
const options = {
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests!, please retry in 1 hour',
};
const limit = rateLimit(options);
app.use('/api', limit);

// mongo sanitize
app.use(mongoSanitize());
// xss-clean
app.use(xssClean());
// parameter pollution
const list = ['duration', 'duration', 'name'];
const paramProtection = hpp({
  whitelist: list,
});
app.use(paramProtection);
// /////////////////////////////////////////////////////
// mount router with middleware

// /////
app.use('/api/v1/services/', serviceRouter);
app.use('/api/v1/testimonies/', testimonieRouter);
app.use('/api/v1/trainings/', trainingRouter);
app.use('/api/v1/departments/', departmentRouter);
app.use('/api/v1/conferences/', conferenceRouter);
app.use('/api/v1/user/', userRouter);

// handle unhandled routes: 404 not found
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} is undefined`, 404));
});

////////////////////////////////////////////////////////Global error middleware handler
app.use(globalErrorHandler);
// ////////////////////////////////////////////////////export the express app to the server
module.exports = app;
