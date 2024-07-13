const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const app = express();
app.use(cors()); 
app.use(bodyParser.json());

app.post('/api/referrals', async (req, res) => {
  const { referrerName, referrerEmail, friendName, friendEmail } = req.body;

  // Validate input
  if (!referrerName || !referrerEmail || !friendName || !friendEmail) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        friendName,
        friendEmail,
      },
    });

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
      auth: {
        user: 'tarun2110101@akgec.ac.in',
        pass: process.env.EMAILPASS,
      },
    });

    const mailOptions = {
      from: 'tarun2110101@akgec.ac.in',
      to: 'tarunlalwani2002@gmail.com',
      subject: 'Course Referral',
      text: `${referrerName} has referred you to a course!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send email' });
      } else {
        return res.status(200).json(referral);
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save referral' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
