// core modules
const fs = require('fs');
// 3rd party
const express = require('express');

// Training model
const ApiFeatures = require('../utils/ApiFeatures')
const AppError = require('../utils/AppError')
const Training = require('../models/trainingModel')
const catchAsync = require('../utils/catchAsync')


/////////////////////
// request handlers(Hnd)CRUD OPS
////////////
// GET req
exports.getAllTrainingsHnd = catchAsync(async (req, res, next) => {
    let features = new ApiFeatures(Training.find(),req.query).filter().sort().limitFields().pagination()
    const trainings = await features.query

    res.status(200).json({
      status: 'success',
      results:trainings.length,
      data:{
        trainings
      }
    });
});
  
////////////
// GET/:byParams requests
exports.getTrainingHnd = catchAsync(async (req, res, next) => {
    const training = await Training.findById(req.params.id)

    if(!training){
      return next(new AppError('no training found',404))
    }


    res.status(200).json({
      // jsend format
      status: 'success',
      data: {
        training
      },
    });
 
});
  
////////////////
// POST
exports.createTrainingHnd = catchAsync(async (req, res, next) => {
    const newTraining = await Training.create(req.body)

    if(!newTraining){
      return next(new AppError('failed to create training',404))
    }

    res.status(201).json({
      status:'success',
      data:{
        newTraining
      }
    })
});
  
///////////////
// PATCH requests
exports.updateTrainingHnd = catchAsync(async (req, res, next) => {
    const training = await Training.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    })

    if(!training){
      return next(new AppError('failed to update training',404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        training,
      },
    });
});
  
///////////////
// DELETE request
exports.deleteTrainingHnd = catchAsync(async (req, res, next) => { 
    const training = await Training.findByIdAndDelete(req.params.id) 

    if(!training){
      return next(new AppError('failed to delete training',404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
  });
});
  


// aggregat pipelines
exports.getUpcoming = catchAsync(async(req,res,next)=>{
    const day = new Date()
    const nextTraining = await Training.aggregate([
      {$unwind:'$date'},
      {
        $match:{date:{$gte: day}}
      },
      {
        $group:{
          _id:'$name',
          numTraining:{ $count: { } }
        }
      },
      {
        $sort:{date:-1}
      },
      {
        $addFields:{name:'$_id'}
      },
      {
        $project:{_id:0}
      },
      {
        $limit:10
      }

    ])

    if(!nextTraining){
      return next(new AppError('failed to find upcoming training',404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        nextTraining
      },
    });
})
