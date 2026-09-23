const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Saves a contact message to the database, after checking the basics.
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill in name, email and message.' });
    }
    if (!emailPattern.test(String(email))) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    await Message.create({ name: String(name), email: String(email), message: String(message) });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
