const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Set email for contact'],
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },

    /* password: { GOOGLE
      type: String,
      required: [true, 'Set password for contact'],
      unique: true,
      minlength: 5,
    }, */
    /* owner: {
      name: String,
      age: Number,
      address: String,
    }, */
  },
  /*  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  }, */
);

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
