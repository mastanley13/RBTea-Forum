// routes/comments.js

const express = require('express');
const router = express.Router();

let comments = [];

router.get('/', (req, res) => {
  res.json(comments);
});

router.post('/', (req, res) => {
  const { text, author } = req.body;
  if (!text || !author) {
    return res.status(400).json({ error: 'Text and author are required' });
  }
  const newComment = { id: Date.now(), text, author };
  comments.push(newComment);
  res.status(201).json(newComment);
});

module.exports = router;
