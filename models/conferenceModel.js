const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// ///////////////////////////////////
// department schema
const conferenceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Conference needs a name'],
      unique: true,
      trim: true,
      maxLength: [50, 'conference name should be less the 50 characters'],
      minLength: [5, 'conference name should be more than 5 characters'],
    },
    slug: {
      type: String,
    },
    conferenceType: {
      type: String,
      required: [
        true,
        'conference needs a type(Men,Women,Communion,Special,etc)',
      ],
    },
    pastors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    duration: {
      type: Number,
      required: [true, 'conference needs a duration'],
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
    startTime: {
      type: String,
      required: [true, 'conference needs a start time'],
    },
    date: {
      type: Date,
      required: [true, 'conference needs a date'],
      default: '2022-04-19T08:43:31.096Z',
    },
    description: {
      type: String,
      required: [true, 'conference needs a description'],
    },
    summary: {
      type: String,
      required: [true, 'conference needs a summary'],
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
      required: [true, 'conference needs cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    familyConference: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

conferenceSchema.index({ date: 1, duration: 1, slug: 1 });
// virtual fields
conferenceSchema.virtual('durationInMinutes').get(function () {
  return this.duration * 60;
});
// mongoose doc middle ware:pre
conferenceSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// mongoose query middle ware:pre
conferenceSchema.pre(/^find/, function (next) {
  this.find({ familyConference: { $ne: true } });
  next();
});
// query middlewar to populated child referenced fields
conferenceSchema.pre(/^find/, function (next) {
  // fill field that references the id with the actual object
  this.populate({
    path: 'pastors',
    select: '-__v -passwordChangedAt -role -_id',
  });
  next();
});

////////////mongoose Aggregation middles
conferenceSchema.pre('aggregate', function (next) {
  this._pipeline.unshift({ $match: { familyConference: { $ne: true } } });
  next();
});
/////////////////////////////////////////////////////// ConferenceModel
const Conference = mongoose.model('Conference', conferenceSchema);

module.exports = Conference;

// ///////////////////////////////////////////////
