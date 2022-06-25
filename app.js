// local Api
const path = require('path');
const cors = require('cors');
// 3rd party modules
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// AppError class:A_E
const AppError = require('./utils/AppError');
// error contoller function
const globalErrorHandler = require('./controllers/errorController');

// require user and service Routes modules
const viewRouter = require('./routes/viewRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const testimonieRouter = require('./routes/testimonieRoutes');
const trainingRouter = require('./routes/trainingRoutes');
const departmentRouter = require('./routes/departmentRoutes');
const conferenceRouter = require('./routes/conferenceRoutes');
const userRouter = require('./routes/userRoutes');
// instance of the express module
const app = express();
app.use(cors({ origin: true }));
// /express view engine set up
// use express to select template engine ie:pug.js
app.set('view engine', 'pug');
// use express to set path to view folder
app.set('views', path.join(__dirname, 'views'));
// get static files and use them with express
app.use(express.static(path.join(__dirname, 'public')));
// GLOBAL MIDDLEWARE
// secure http headers with helmet

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],

      baseUri: ["'self'"],

      fontSrc: ["'self'", 'https:', 'data:'],

      scriptSrc: ["'self'", 'https://*.cloudflare.com'],

      scriptSrc: ["'self'", 'https://*.stripe.com'],

      scriptSrc: ["'self'", 'http:', 'https://*.mapbox.com', 'data:'],

      frameSrc: ["'self'", 'https://*.stripe.com'],

      objectSrc: ["'none'"],

      styleSrc: ["'self'", 'https:', 'unsafe-inline'],

      workerSrc: ["'self'", 'data:', 'blob:'],

      childSrc: ["'self'", 'blob:'],

      imgSrc: ["'self'", 'data:', 'blob:'],

      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],

      upgradeInsecureRequests: [],
    },
  })
);
app.use(cookieParser());
// logger middlerware
if (process.env.NODE_ENV === 'developement') {
  // 3rd party middleware:logger
  app.use(morgan('dev'));
}
// express middleware:body parser read data from request
app.use(express.json());

//Isioma// -> added this to read the input from form submit
app.use(express.urlencoded({ extended: true }));
//Isioma//

// midleware for req time
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept '
  );
  next();
});
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
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });
// /////////////////////////////////////////////////////
// mount router with middleware

// /////
app.use('/', viewRouter);
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
