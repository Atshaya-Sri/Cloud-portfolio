// File: netlify/functions/submit-form.js

const nodemailer = require('nodemailer');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // This uses the secure credentials from your Netlify settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    const formData = JSON.parse(event.body);

    const emailHtml = `
      <div>
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>From Email:</strong> ${formData.email}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      </div>
    `;

    const mailOptions = {
      from: `"Portfolio Site" <${process.env.GMAIL_ADDRESS}>`,
      to: process.env.GMAIL_ADDRESS,
      replyTo: formData.email,
      subject: `New Message from ${formData.name}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email.' }),
    };
  }
};