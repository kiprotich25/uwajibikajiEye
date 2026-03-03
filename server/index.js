const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const reportRoutes = require('./routes/reportRoutes');
const ussdRoutes = require('./routes/ussdRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/api/reports', reportRoutes);
app.use('/api/ussd', ussdRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/candidates', candidateRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Uwajibikaji-Eye API is running', status: 'ok' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/uwajibikaji-eye';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
