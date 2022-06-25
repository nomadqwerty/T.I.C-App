// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const Testimonie = require('../models/testimonieModel');
const Service = require('../models/serviceModel');
const Conference = require('../models/conferenceModel');
const Training = require('../models/trainingModel');
const Department = require('../models/departmentModel');
const User = require('../models/userModel')

const catchAsync = require('../utils/catchAsync');

const jwt = require('jsonwebtoken');

const testimonies = async () => {
  const tests = await Testimonie.find();

  return tests;
};

// jwt sign function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};


// Isioma //
const createJWT = (user, statusCode, res) => {

  try{
    const token = signToken(user._id);

    let cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    // send jwt in cookie
    // set cookieOptions.secure to true in production
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);
  
    // set reset token and token expires to undefined
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return { 
      token
    }
    // send response
    // res.status(statusCode).json({
    //   status: 'success',
    //   token,
    //   data: {
    //     user,
    //   },
    // });
  }catch(e){
    console.log(e)
  }
};
// Isioma //

exports.getRoot = catchAsync(async (req, res, next) => {
  const resources = [
    {
      name: 'Impact Conferences',
      imageCover: 'tour-2-cover.jpg',
      summary: `join Impact Conferences and see the manifestation of God in your life`,
      location: 'Port-Harcourt, Rivers State',
      path: 'overview-conferences',
    },
    {
      name: 'Impact Services',
      imageCover: 'tour-2-cover.jpg',
      summary: `join Impact Services and see the manifestation of God in your life`,
      location: 'Port-Harcourt, Rivers State',
      path: 'overview-services',
    },
    {
      name: 'Impact Trainings',
      imageCover: 'tour-2-cover.jpg',
      summary: `join Impact Training and see the manifestation of God in your life`,
      location: 'Port-Harcourt, Rivers State',
      path: 'overview-trainings',
    },
    {
      name: 'Impact Departments',
      imageCover: 'tour-2-cover.jpg',
      summary: `Impact Department, Don't just be a spectator! partake in kingdom service`,
      location: 'Anywhere',
      path: 'overview-departments',
    },
  ];

  // Isioma //
  try{
    let loggedInUser = req.local && req.local.user

    if (loggedInUser) {

      return res.status(200).render('root', {
        title: 'resources',
        resources,
        user: loggedInUser
      });

    }else{

      return res.status(200).render('root', {
        title: 'resources',
        resources,
      });

    }
  }catch(e){
    console.log(e)
  }
  // Isioma //

});
exports.getOverview = catchAsync(async (req, res, next) => {
  const services = await Service.find();
  res.status(200).render('overviewServices', {
    title: 'All services',
    services,
  });
});
// conference overview
exports.getOverviewConference = catchAsync(async (req, res, next) => {
  const conferences = await Conference.find();
  // console.log(conferences[0]);
  res.status(200).render('overviewConferences', {
    title: 'All conferences',
    conferences,
  });
});
exports.getOverviewTraining = catchAsync(async (req, res, next) => {
  const trainings = await Training.find();
  // console.log(trainings[0]);
  res.status(200).render('overviewTrainings', {
    title: 'All trainings',
    trainings,
  });
});

exports.getOverviewDepartment = catchAsync(async (req, res, next) => {
  const departments = await Department.find();
  // console.log(departments[0]);
  res.status(200).render('overviewDepartments', {
    title: 'All departments',
    departments,
  });
});

exports.getservice = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  const service = await Service.findOne({ slug: req.params.slug });
  const review = await testimonies();
  // console.log(service);
  // pass into
  res.status(200).render('service', {
    title: service.name,
    service,
    review,
  });
});
exports.getconference = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  const conference = await Conference.findOne({ slug: req.params.slug });
  const review = await testimonies();
  // console.log(conference);
  // pass into
  res.status(200).render('conference', {
    title: conference.name,
    conference,
    review,
  });
});

exports.getTraining = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  const training = await Training.findOne({ slug: req.params.slug });
  const review = await testimonies();
  // console.log(training);
  // pass into
  res.status(200).render('training', {
    title: training.name,
    training,
    review,
  });
});
exports.getDepartment = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  const department = await Department.findOne({ slug: req.params.slug });
  const review = await testimonies();
  // console.log(department);
  // pass into
  res.status(200).render('department', {
    title: department.name,
    department,
    review,
  });
});

// Isioma //
exports.postLogin = async (req, res, next) => {

  try{
    const email = req.body.email;
    const password = req.body.password;
  
    if (!email && !password) {
      //install express-flash to show user error messages
      // return next(new AppError('please provide email and password', 400));
      return res.redirect('/login');
    }
  
    const user = await User.findOne({ email: email }).select('+password');
  
    if (!user || !(await user.comparePasswords(password, user.password))) {
       //install express-flash to show user error messages
      return res.redirect('/login');
    }
  
    const { token } =  createJWT(user, 200, res)
    
    if (!user && !token){
      return res.redirect('/login');
    }

    req.local = {}
    req.local.user = user

    // return res.render('/', {
    //   user: user
    // });
    next()

  }catch(e){
    console.log(e)
  }
}
// Isioma //


// login and signup is synchronous
exports.login = (req, res, next) => {

  res.status(200).render('login', { });

};
exports.signUp = (req, res, next) => {
  res.status(200).render('signup', {});
};
