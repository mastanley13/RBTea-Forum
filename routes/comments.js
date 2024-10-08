// routes/comments.js

const express = require('express');
const { check, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const fetch = require('node-fetch');

const router = express.Router();

// POST /api/comments - Add a new comment
router.post(
  '/',
  [
    check('name').isLength({ max: 50 }).trim().escape(),
    check('comment').isLength({ max: 500 }).trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, comment } = req.body;
      const newComment = new Comment({ name, comment });
      await newComment.save();

      // Emit event to all connected clients
      const io = req.app.get('io');
      io.emit('newComment', newComment);

      res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding comment' });
    }
  }
);

// GET /api/comments - Retrieve all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ timestamp: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

module.exports = router;
