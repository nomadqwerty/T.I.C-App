const mongoose = require('mongoose');

let testimonieSchema = new mongoose.Schema(
  {
    testimonie: {
      type: String,
      required: [true, 'Empty field'],
      trim: true,
      minLength: [5, ' text is to short'],
      maxLength: [500, ' text is to long'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    serviceName: {
      type: String,
      required: [true, 'please enter name of conference, service or training'],
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    training: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Training',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// mongoose query middle ware:pre
testimonieSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt -role -_id',
  }).populate({
    path: 'training',
    select:
      '-__v -trainingType -sessions -duration -startTime -zoomId -facebookPage -location -images -secretTraining -createdAt -durationPerSession -durationInWeeks -slug -id -_id',
  });

  next();
});
/////////////////////////////////////////////////////// ServiceModel
const Testimonie = mongoose.model('Testimonie', testimonieSchema);

module.exports = Testimonie;
