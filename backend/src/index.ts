import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import geminiRoutes from './routes/geminiRoutes';
import linkedinRoutes from './routes/linkedinRoutes';

// Load environment variables from .env file

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors()); // Allow all CORS requests for development. Refine for production.
app.use(express.json()); // Enable parsing of JSON request bodies

// API Routes
app.use('/api/gemini', geminiRoutes);
app.use('/api/linkedin', linkedinRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('LinkedIn Automation Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access backend at http://localhost:${PORT}`);
});

