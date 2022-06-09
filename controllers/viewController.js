// 3rd party
const express = require('express');
// service model
const AppError = require('../utils/AppError');
const Testimonie = require('../models/testimonieModel');
const Service = require('../models/serviceModel');
const Conference = require('../models/conferenceModel');

const catchAsync = require('../utils/catchAsync');

exports.getRoot = catchAsync(async (req, res, next) => {
  const resources = [
    {
      name: 'Impact Conferences',
      imageCover: 'tour-2-cover.jpg',
      summary: `join Impact Conferences and see the manifestation of God in your life`,
      location: 'Port-Harcourt, Rivers State',
      path: 'overview1',
    },
    {
      name: 'services',
      imageCover: 'tour-2-cover.jpg',
      summary: `join Impact Services and see the manifestation of God in your life`,
      location: 'Port-Harcourt, Rivers State',
      path: 'overview',
    },
    {
      name: 'Impact Trainings',
      imageCover: 'tour-2-cover.jpg',
      summary: `join Impact Training and see the manifestation of God in your life`,
      location: 'Port-Harcourt, Rivers State',
    },
    {
      name: 'Impact Testimonies',
      imageCover: 'tour-2-cover.jpg',
      summary: `Impact Testimonies, see the manifestation of God in the life of other`,
      location: 'International',
    },
  ];

  res.status(200).render('root', {
    title: 'resources',
    resources,
  });
});
exports.getOverview = catchAsync(async (req, res, next) => {
  const services = await Service.find();
  res.status(200).render('overview', {
    title: 'All services',
    services,
  });
});
// conference overview
exports.getOverviewConference = catchAsync(async (req, res, next) => {
  const conferences = await Conference.find();
  console.log(conferences[0]);
  res.status(200).render('overview1', {
    title: 'All conferences',
    conferences,
  });
});

exports.getservice = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const service = await Service.findOne({ slug: req.params.slug });
  console.log(service);
  // pass into
  res.status(200).render('service', {
    title: service.name,
    service,
  });
});
exports.getconference = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const conference = await Conference.findOne({ slug: req.params.slug });
  console.log(conference);
  // pass into
  res.status(200).render('conference', {
    title: conference.name,
    conference,
  });
});
