const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const config = require('../config/config');

require('dotenv').config();

class CreateSenderSendgrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    return await sgMail.send({ ...msg, from: config.email.sendgrid }); // Cherepanova@ex.ua
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const options = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: config.email.nodemailer, // emailtestgrid@meta.ua
        pass: process.env.PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(options);
    const emailOptions = {
      from: config.email.nodemailer, // emailtestgrid@meta.ua
      ...msg,
    };

    return await transporter.sendMail(emailOptions);
  }
}

module.exports = { CreateSenderSendgrid, CreateSenderNodemailer };
/*
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })*/
