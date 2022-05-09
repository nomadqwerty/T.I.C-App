// 3rd party
const express = require('express');

// service model
const Service = require('../models/serviceModel')
const ApiFeatures = require('../utils/ApiFeatures')

// error handler modules
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')

////////////:request handlers(Hnd)CRUD OPS
// GET req
exports.getAllServicesHnd = catchAsync(async (req, res,next) => {
    const features = new ApiFeatures(Service.find(),req.query).filter().sort().limitFields().pagination()

    const services = await features.query
    res.status(200).json({
      status: 'success',
      results:services.length,
      data:{
        services
      }
    });
});
  
// GET/:byParams requests
exports.getServiceHnd = catchAsync(async (req, res,next) => {
    const service = await Service.findById(req.params.id)
  
    if(!service){
      return next(new AppError('no service found',404))
    }

    res.status(200).json({
      // jsend format
      status: 'success',
      data: {
        service
      },
    });
});
  
// POST
exports.createServiceHnd = catchAsync(async (req, res,next) => {
    const newService = await Service.create(req.body)
    
    if(!newService){
      return next(new AppError('failed to create service',404))
    }

    res.status(201).json({
      status: 'success',
      data: {
        newService,
      }
    });
});
  
// PATCH requests
exports.updateServicehnd = catchAsync(async (req, res,next) => {
      const service = await Service.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
      })
      if(!service){
        return next(new AppError('can not update!!!. Service does not exist',404))
      }
      res.status(200).json({
        status: 'success',
        data: {
          service,
        },
      });
});
  
// DELETE request
exports.deleteServiceHnd = catchAsync(async (req, res,next) => {
    const service = await Service.findByIdAndDelete(req.params.id)

    if(!service){
      return next(new AppError('can not delete!!!. Service does not exist',404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
  });
});

// controllers for agregation pipelines

exports.getUpcoming = catchAsync(async (req,res,next)=>{
  
    let thisMoment = new Date().getDay()
    if(thisMoment===6)thisMoment=0

    const nextService = await Service.aggregate([
      {
        $match:{dateIndex:{$gte:thisMoment}},
      },
      {$group:{
          _id:'$name',
          numServices:{ $count: { } }}
      },
      {
        $sort:{dateIndex:-1}
      },
      {
        $addFields:{name:'$_id'}
      },
      {
        $project:{numServices:0,_id:0}
      },
      {
        $limit:10
      }
    ])

    if(!nextService){
      return next(new AppError('can not find services!!!',404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        nextService,
      }
    })
})

// alias middleware
exports.getAlias = catchAsync(async (req,res,next)=>{
  
    let thisMoment = new Date().getDay()
    if(thisMoment===6)thisMoment=0

    const nextService = await Service.find({dateIndex:{$gte:thisMoment}})
    
    if(!nextService){
      return next(new AppError('can not find services!!!',404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        nextService,
      }
    })
})