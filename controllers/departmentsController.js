// core modules
const fs = require('fs');
// 3rd party
const express = require('express');

// department model
const Department = require('../models/departmentModel')
const ApiFeatures = require('../utils/ApiFeatures')
const catchAsync = require('../utils/catchAsync')

/////////////////////
// request handlers(Hnd)CRUD OPS
////////////
// GET req
exports.getAllDepartmentsHnd = catchAsync(async (req, res, next) => {

    const features = new ApiFeatures(Department.find(),req.query).filter().sort().limitFields().pagination()
    const departments = await features.query

    res.status(200).json({
      status: 'success',
      results:departments.length,
      data:{
        departments
      }
    });
});
  
////////////
// GET/:byParams requests
exports.getDepartmentHnd = catchAsync(async (req, res, next) => {
    const department = await Department.findById(req.params.id)

    if(!department){
      return next(new AppError('no department found',404))
    }

    res.status(200).json({
      // jsend format
      status: 'success',
      data: {
        department
      },
    });
  
});
  
////////////////
// POST
exports.createDepartmentHnd = catchAsync(async (req, res, next) => {
      const newDepartment = await Department.create(req.body)

      if(!newDepartment){
        return next(new AppError('failed to create new department',404))
      }
      
      res.status(201).json({
        status:'success',
        data:{
          newDepartment
        }
      })
   
});
  
///////////////
// PATCH requests
exports.updateDepartmentHnd = catchAsync(async (req, res, next) => {
    const department = await Department.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    })

    if(!department){
      return next(new AppError('failed to update department',404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        department,
      },
    });
   
});
  
///////////////
// DELETE request
exports.deleteDepartmentHnd = catchAsync(async (req, res, next) => { 
    const deparment = await Department.findByIdAndDelete(req.params.id) 

    if(!department){
      return next(new AppError('failed to delete department',404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  
});
  
// aggregation pipeline

exports.getNextMeeting = catchAsync(async (req,res,next)=>{
    let thisMoment = new Date().getDay()

    const nextMeeting = await Department.aggregate([
      {
        $match:{meetingDays:{$lte:thisMoment}}
      },
      {
        $project:{
          _id:0,
          zoomId:0,
          facebookPage:0,
          images:0,
          createdAt:0,
          imageCover:0,
          __v:0
        }
      }
    ])

    if(!nextMeeting){
      return next(new AppError('failed to find meeting',404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        nextMeeting
      },
    });
 
})