const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
// ///////////////////////////////////
// department schema
const departmentSchema = new mongoose.Schema({
    name:{
      type:String,
      required:[true,'Department needs a name'],
      unique: true,
      trim:true,
      maxLength:[20,'Department name should be less the 20 characters'],
      minLength:[5,'Department name should be more than 5 characters'],
      validate:[validator.isAlpha,'name must contain only letters']
    },
    slug:{
      type:String
    },
    meetings:{
      type:Number,
      default:1
    },
    meetingDays:{
      type:Number,
      required:[true,'meeting dayIndex required'],
      select:false,
      min:[0,'meetingDay should be >= 0'],
      max:[6,'meetingDay should be <= 6']
    },
    day:{
      type:String,
      required:[true,'meeting needs a day'],
      default:'monday',
      enum:{
        values:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
        message:'must be a weekday'
      }
    },
    description:{
      type:String,
      required:[true, 'department needs a description'],
      unique:true
  
    },
    summary:{
      type:String,
      required:[true, 'department needs a summary'],
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
      required:[true,'department needs cover image']
    },
    images:[String],
    createdAt:{
      type:Date,
      default: Date.now(),
      select:false
    }
})
// mongoose doc middle ware:pre
departmentSchema.pre('save',function(next){
  this.slug = slugify(this.name,{lower:true})
  next()
})


/////////////////////////////////////////////////////// departmentModel
const Department = mongoose.model('Department',departmentSchema)

module.exports = Department

