// backend/server.js

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Use the API routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
