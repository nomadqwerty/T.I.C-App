const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
// ///////////////////////////////////
// training schema
const trainingSchema = new mongoose.Schema({
    name:{
      type:String,
      required:[true,'Training needs a name'],
      unique: true,
      trim:true,
      maxLength:[20,'training name should be less the 20 characters'],
      minLength:[5,'training name should be more than 5 characters'],
      validate:[validator.isAlpha,'name must contain only letters']
    },
    slug:{
      type:String
    },
    trainingType:{
      type:String,
      required:[true,'training needs a type(sermon,training,counsel etc)']
    },
    sessions:{
      type:Number,
      default:1
    },
    duration:{
      type:Number,
      required:[true,'training needs a duration']
    },
    startTime:{
      type:String,
      required:[true,'training needs a start time']
    },
    date:{
      type:Date,
      required:[true,'conference needs a date'],
      default: "2022-10-19T08:43:31.096Z"
    },
    description:{
      type:String,
      required:[true, 'training needs a description'],
      unique:true
  
    },
    summary:{
      type:String,
      required:[true, 'training needs a summary'],
      trim:true
    },
    zoomId:{
      type:Number,
      default:123456
    },
    facebookPage:{
      type:String,
      default:'the impact church'
    },
    imageCover:{
      type:String,
      required:[true,'training needs cover image']
    },
    images:[String],
    createdAt:{
      type:Date,
      default: Date.now(),
      select:false
    },
    secretTraining:{
      type:Boolean,
      default:false
    }
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})

// virtual fields
trainingSchema.virtual('durationInWeeks').get(function(){
  return this.sessions*7
})
trainingSchema.virtual('durationPerSession').get(function(){
  return this.duration*60
})

// mongoose doc middle ware:pre
trainingSchema.pre('save',function(next){
  this.slug = slugify(this.name,{lower:true})
  next()
})
// mongoose query middle ware:pre
trainingSchema.pre(/^find/,function(next){
  this.find({secretTraining:{$ne:true}})
  next()
})
////////////mongoose Aggregation middles
trainingSchema.pre('aggregate',function(next){
  this._pipeline.unshift({$match:{secretTraining:{$ne:true}}})
  next()
})
/////////////////////////////////////////////////////// ServiceModel
const Training = mongoose.model('Training',trainingSchema)

module.exports = Training
  