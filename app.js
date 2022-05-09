// 3rd party modules
const express = require('express');
const morgan = require('morgan');

// AppError class:A_E
const AppError = require('./utils/AppError')
// error contoller function
const globalErrorHandler = require('./controllers/errorController')

// require user and service Routes modules
const serviceRouter = require('./routes/serviceRoutes');
const trainingRouter = require('./routes/trainingRoutes')
const departmentRouter = require('./routes/departmentRoutes')
const conferenceRouter = require('./routes/conferenceRoutes')
const userRouter = require('./routes/userRoutes');
// instance of the express module
const app = express();


if(process.env.NODE_ENV==='developement') {
  // 3rd party middleware:logger
  app.use(morgan('dev'))
}
  ;
// express middleware
app.use(express.json());
// midlewar for req time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
   next();
});


// /////////////////////////////////////////////////////
// mount router with middleware
app.use('/api/v1/services/', serviceRouter);
app.use('/api/v1/trainings/',trainingRouter)
app.use('/api/v1/departments/',departmentRouter)
app.use('/api/v1/conferences/',conferenceRouter)
app.use('/api/v1/user/', userRouter);

// handle unhandled routes: 404 not found
app.all('*',(req,res,next)=>{
  
  next(new AppError(`${req.originalUrl} is undefined`,404))

})

////////////////////////////////////////////////////////Global error middleware handler
app.use(globalErrorHandler)
// ////////////////////////////////////////////////////export the express app to the server 
module.exports = app