// this modue imports and detes data from database
// /////////////////////////////////////////////
///// require the fs modules
const fs = require('fs');
// model to write to
const Service = require('../../models/serviceModel');
const Conference = require('../../models/conferenceModel');
const Training = require('../../models/trainingModel');
const Department = require('../../models/departmentModel');
const Testimonies = require('../../models/testimonieModel');

////// require dotenv:set node enviroment variables
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// set eviroment variable:node.js
// $env:NODE_ENV="developement" ; supervisor server.js
//the node process object holds the env which will hold the NODE_ENV property:process.env.NODE_ENV
// OR
// set enviroment variables with dotenv
dotenv.config({ path: '../../config.env' });
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

// read file and write to dataBAse
const services = JSON.parse(fs.readFileSync('./servicesMain.json', 'utf-8'));
const conferences = JSON.parse(
  fs.readFileSync('./conferenceMain.json', 'utf-8')
);
const trainings = JSON.parse(fs.readFileSync('./trainingsMain.json', 'utf-8'));
const departments = JSON.parse(
  fs.readFileSync('./departmentsMain.json', 'utf-8')
);

// send data to db

const importData = async (Model, input) => {
  try {
    await Model.create(input);
    console.log('Data has been written to DataBase');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// clear data from db

const deleteData = async (Model) => {
  try {
    await Model.deleteMany();
    console.log('data has been cleared from DataBase');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// condition for Model to delete
if (process.argv[2] === '--importService') {
  importData(Service, services);
} else if (process.argv[2] === '--deleteService') {
  deleteData(Service);
}

if (process.argv[2] === '--importConference') {
  importData(Conference, conferences);
} else if (process.argv[2] === '--deleteConference') {
  deleteData(Conference);
}

if (process.argv[2] === '--importTraining') {
  importData(Training, trainings);
} else if (process.argv[2] === '--deleteTraining') {
  deleteData(Training);
}
if (process.argv[2] === '--importDepartment') {
  importData(Department, departments);
} else if (process.argv[2] === '--deleteDepartment') {
  deleteData(Department);
}
if (process.argv[2] === '--deleteTestimonies') {
  deleteData(Testimonies);
}

// node importDevData.js --importService,node importDevData.js --deleteService
