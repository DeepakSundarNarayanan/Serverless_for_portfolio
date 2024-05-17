const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "************@gmail.com",
    pass: "*********"
  }
});

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    // Return a 200 OK response for OPTIONS requests
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, GET"
      },
      body: ""
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { firstName, lastName, email, phone, message } = JSON.parse(event.body);

  const name = firstName + ' ' + lastName;
  const mail = {
    from: name,
    to: 'deepaksundarnarayanan@gmail.com',
    subject: 'Contact Form Submission - Portfolio',
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`
  };

  try {
    await contactEmail.sendMail(mail);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, GET"
      },
      body: JSON.stringify({ message: 'Message Sent' })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email' }) };
  }
};

