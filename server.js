const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
