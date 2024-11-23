import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';

import connectDB from './dbConnect.js';

import authRouter from './routes/auth-routes.js';
import postsRouter from './routes/posts-routes.js';

// Load environment variables
configDotenv();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// db connection
await connectDB();

// routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

// start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
