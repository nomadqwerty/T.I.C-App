const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// ///////////////////////////////////
// department schema
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service needs a name'],
      unique: true,
      trim: true,
      maxLength: [50, 'service name should be less the 20 characters'],
      minLength: [5, 'service name should be more than 5 characters'],
    },
    slug: {
      type: String,
    },
    serviceType: {
      type: String,
      required: [true, 'Service needs a type(sermon,training,counsel etc)'],
    },
    services: {
      type: Number,
      default: 1,
    },
    pastors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    duration: {
      type: Number,
      required: [true, 'Service needs a duration'],
    },
    startTime: {
      type: String,
      required: [true, 'Service needs a start time'],
    },
    date: {
      type: String,
      required: [true, 'Service needs a date'],
    },
    dateIndex: {
      type: Number,
      required: [true, 'date index required'],
      select: false,
      min: [0, 'dateIndex should be >= 0'],
      max: [6, 'dateIndex should be <= 6'],
    },
    description: {
      type: String,
      required: [true, 'Service needs a description'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Service needs a summary'],
      trim: true,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
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
      required: [true, 'Service needs cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    familyService: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// virtual fields
serviceSchema.virtual('durationInMinutes').get(function () {
  return this.duration * 60;
});

// mongoose doc middle ware:pre
serviceSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// mongoose query middle ware:pre
serviceSchema.pre(/^find/, function (next) {
  this.find({ familyService: { $ne: true } });
  this.starts = Date.now();
  next();
});
// post query midware
serviceSchema.post(/^find/, function (docs, next) {
  next();
});
// query middlewar to populated child referenced fields
serviceSchema.pre(/^find/, function (next) {
  // fill field that references the id with the actual object
  this.populate({
    path: 'pastors',
    select: '-__v -passwordChangedAt -role -_id',
  });
  next();
});

////////////mongoose Aggregation middles
serviceSchema.pre('aggregate', function (next) {
  this._pipeline.unshift({ $match: { familyService: { $ne: true } } });
  next();
});
/////////////////////////////////////////
//////// static methods
serviceSchema.static.calcAvgDur = function () {
  this.aggregate([
    {
      $match: { duration: { $gte: 2 } },
    },
    {
      $group: {
        _id: '$name',
        nServices: { $count: {} },
      },
    },
  ]);
};
/////////////////////////////////////////////////////// ServiceModel
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;

// ///////////////////////////////////////////////
