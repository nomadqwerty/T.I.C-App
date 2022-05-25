const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
// ///////////////////////////////////
// training schema
const trainingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Training needs a name'],
      unique: true,
      trim: true,
      maxLength: [50, 'training name should be less the 50 characters'],
      minLength: [5, 'training name should be more than 5 characters'],
    },
    slug: {
      type: String,
    },
    trainingType: {
      type: String,
      required: [true, 'training needs a type(sermon,training,counsel etc)'],
    },
    pastors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    sessions: {
      type: Number,
      default: 1,
    },
    duration: {
      type: Number,
    },
    startTime: {
      type: String,
      required: [true, 'training needs a start time'],
    },
    startDate: {
      type: [String],
      required: [true, 'Training needs a date'],
      default: '2022-10-19T08:43:31.096Z',
    },
    description: {
      type: String,
      required: [true, 'training needs a description'],
    },
    summary: {
      type: String,
      required: [true, 'training needs a summary'],
      trim: true,
    },
    zoomId: {
      type: Number,
      default: 123456,
    },
    facebookPage: {
      type: String,
      default: 'the impact church',
    },
    imageCover: {
      type: String,
      required: [true, 'training needs cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTraining: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual populate
trainingSchema.virtual('testimonies', {
  ref: 'Testimonie',
  foreignField: 'training',
  localField: '_id',
});
// virtual fields
trainingSchema.virtual('durationInWeeks').get(function () {
  return this.sessions * 7;
});
trainingSchema.virtual('durationPerSession').get(function () {
  return this.duration * 60;
});

// mongoose doc middle ware:pre
trainingSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// embed doc middleware
// trainingSchema.pre('save', async function (next) {
//   const pastors = this.pastors.map(async (id) => {
//     return await User.findById(id);
//   });
//   this.pastors = await Promise.all(pastors);

//   next();
// });
// mongoose query middle ware:pre

trainingSchema.pre(/^find/, function (next) {
  this.find({ secretTraining: { $ne: true } });
  next();
});
// query middlewar to populated child referenced fields
trainingSchema.pre(/^find/, function (next) {
  // fill field that references the id with the actual object
  this.populate({
    path: 'pastors',
    select: '-__v -passwordChangedAt -role -_id',
  });
  next();
});
////////////mongoose Aggregation middles
trainingSchema.pre('aggregate', function (next) {
  this._pipeline.unshift({ $match: { secretTraining: { $ne: true } } });
  next();
});
/////////////////////////////////////////////////////// ServiceModel
const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
