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
  });
  next();
});
//////////////////////
////static method
testimonieSchema.statics.avgTestimonies = async function () {
  const stats = await this.aggregate([
    {
      $match: { testimonie: { $gte: '' } },
    },
    {
      $group: {
        _id: '$serviceName',
        nTestimonies: { $count: {} },
      },
    },
  ]);
  console.log(stats);
};

testimonieSchema.post('save', async function (next) {
  await this.constructor.avgTestimonies();
});
/////////////////////////////////////////////////////// ServiceModel
const Testimonie = mongoose.model('Testimonie', testimonieSchema);

module.exports = Testimonie;
