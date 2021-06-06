const mongoose = require('mongoose');
const { Schema } = mongoose;
const gravatar = require('gravatar');
const { Subscription } = require('../../helpers/constants');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/gi;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      unique: true,
      minlength: 5,
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: 250 }, true); // если false это http (true=https)
      },
    },
    // starter", "pro", "business
    subscription: {
      type: String,
      enum: {
        values: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
        message: 'It is not allowed',
      },
      default: Subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);
// сделать hash перед записью в базу данных
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};
const User = mongoose.model('user', userSchema);

module.exports = User;
