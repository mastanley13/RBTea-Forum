// app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const commentRoutes = require('./routes/comments');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/comments', commentRoutes);

// Serve static files
app.use(express.static('public'));

const server = http.createServer(app);
const io = socketIo(server);

// On connection
io.on('connection', (socket) => {
  console.log('New client connected');
});

// Make io available in routes
app.set('io', io);

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('Full error object:', err);
  process.exit(1);
});

// Remove or comment out this line
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
