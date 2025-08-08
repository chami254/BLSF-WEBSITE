const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (your HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, phone, location, message } = req.body;

  console.log('Form submission received:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Phone: ${phone}`);
  console.log(`Location: ${location}`);
  console.log(`Message: ${message}`);

  // Respond with success
  res.send('Thank you for volunteering!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/contact', async (req, res) => {
  const { name, email, message, 'bot-field': botField } = req.body;

  // 🐝 Honeypot trap
  if (botField) {
    return res.status(400).json({ message: 'Bot detected.' });
  }

  try {
    // ✉️ Configure transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail', // or "outlook", or your custom SMTP settings
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_app_password', // Use App Password if using Gmail
      },
    });

    // 💌 Compose email
    const mailOptions = {
      from: `"Website Contact" <your_email@gmail.com>`,
      to: 'destination_email@example.com',
      subject: 'New Contact Form Submission',
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // 🚀 Send mail
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
