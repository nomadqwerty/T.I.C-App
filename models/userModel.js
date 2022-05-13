const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please use a valid email'],
  },
  role: {
    type: String,
    enum: ['member', 'admin', 'pastor', 'lead-pastor'],
    default: 'member',
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'password is required'],
    select: false,
    minLength: [8, 'password should be more than 7 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm password'],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Passwords don't match",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// pre-hook middleware hash password
userSchema.pre('save', async function (next) {
  // function works if password was changed
  if (!this.isModified('password')) return;

  // use bcrypt library to hash the password
  // bcrypt.hash('password',cost=12)
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// update user password changeAt field
userSchema.pre('save', function (next) {
  // if this.isModified || this.isNew is false then
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  // incase password change is slower than jwt issuace minus 1000ms from date.now()
  // set password changed at
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

////////////////////////////////////////
///instance method
userSchema.methods.comparePasswords = async function (userPass, dbPass) {
  return await bcrypt.compare(userPass, dbPass);
};
userSchema.methods.passwordChanged = function (JWTtimeStamp) {
  if (this.passwordChangedAt) {
    const timeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTtimeStamp < timeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  // crearte reset token
  let token = crypto.randomBytes(32).toString('hex');
  // hash token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  // set token expires
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};
////////////////////////////////////////////////////////////User model
const User = mongoose.model('User', userSchema);

// export model
module.exports = User;
