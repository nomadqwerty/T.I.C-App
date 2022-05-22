// server file for app set up
////// require dotenv:set node enviroment variables
const dotenv = require('dotenv');

// handle uncaught execeptions or synch code

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('uncaught Exception found');
  console.log('node process is down....');
  process.exit(1);
});

// /////////////////////////////////////////////
///// require the express app from app.js
const app = require('./app');
// mongoose
const mongoose = require('mongoose');
// set eviroment variable:node.js
// $env:NODE_ENV="developement" ; supervisor server.js
//the node process object holds the env which will hold the NODE_ENV property:process.env.NODE_ENV
// OR
// set enviroment variables with dotenv
dotenv.config({ path: './config.env' });
console.log(process.env.NODE_ENV);

// ////////////////////////////////////////////////////connect database to express app
const connectDB = async () => {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATBASE_PASSWORD
  );
  try {
    const connect = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('database connected');
  } catch (err) {
    console.log(err);
  }
};
console.log(connectDB());

////////////
// server port
const port = process.env.PORT || 8080;

//////////////
// SERVER
//////////////
// SERVER
const server = app.listen(port, () => {
  console.log('server on', port);
});

// handle unhandled promise reject
process.on('unhandledRejection', (err) => {
  server.close(() => {
    console.log('server is down....');
    process.exit(1);
  });
});
