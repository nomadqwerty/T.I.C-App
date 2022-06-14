// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const Testimonie = require('../models/testimonieModel');
const Service = require('../models/serviceModel');
const Conference = require('../models/conferenceModel');
const Training = require('../models/trainingModel');
const Department = require('../models/departmentModel');

const catchAsync = require('../utils/catchAsync');

const testimonies = async () => {
  const tests = await Testimonie.find();

  return tests;
};

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

  res.status(200).render('root', {
    title: 'resources',
    resources,
  });
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
