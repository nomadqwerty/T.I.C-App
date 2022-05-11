// node modules
const promisify = require('util').promisify
// 3rd party
const express = require('express');
const jwt = require('jsonwebtoken');
// service model
const User = require('../models/userModel')
// error handler modules
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')

// jwt sign function
const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES}
    );
}

exports.signUp = catchAsync( async (req,res,next)=>{
    // filter unwanted data fields
    // new user data
   const newUser = await User.create({
       name:req.body.name,
       email:req.body.email,
       password:req.body.password,
       passwordConfirm:req.body.passwordConfirm,
       passwordChangedAt:req.body.passwordChangedAt,
       role:req.body.role
   }) 

//    create JWT for auth
// login in use with jwt 
   const token = signToken(newUser._id)
   
   // error if user craetion failed
   if(!newUser){
       next(new AppError('failed to create user',400))
   }
//    return new user data
   res.status(201).json({
       status:'success',
       token,
       data:{
           newUser
        }
   })
})

////////////login
exports.login = catchAsync( async (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    
    if(!email&&!password){
        return next(new AppError('please provide email and password',400))
    }
    
    const user = await User.findOne({email:email}).select('+password')
    
    if(!user||!(await user.comparePasswords(password,user.password))){
        return next(new AppError('incorrect email and password',401))
    }
    //    create JWT for auth
    // login in use with jwt 
    const token = signToken(user._id)
    
    res.status(200).json({
        status:'success',
        token,
        data:{

        }
    })

})

// protect middleware: check if user logged in
exports.protect = catchAsync(async (req,res,next)=>{
    let token
    // check for token in headers
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    // if no token return new Error
    if(!token){
        return next(new AppError('you are not authorized',401))
    }

    // verify token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    // check if user exists
    const freshUser = await User.findById(decoded.id)
    
    if(!freshUser){
        return next(new AppError('this user no longer exists',401))
    }
    // check if user changedpassword after jwt was issued
    let passwordWasChanged =  freshUser.passwordChanged(decoded.iat)

    if(passwordWasChanged){
        return next(new AppError('User currently changed password,please login again',401))
    }
    req.user = freshUser
    // access protected routes
    next()
})

// restrict middleware
exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('you cannot perform this action',403))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email})

    if(!user){
        return next(new AppError('user does not exist',404))
    }

    const token = user.createPasswordResetToken()

    // turn off validation
    await user.save({validateBeforeSave:false})

    console.log(user)
})