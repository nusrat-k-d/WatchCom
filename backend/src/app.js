import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import movieRoutes from './routes/movieRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'WatchCom API is running' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'WatchCom Backend Running 🚀',
  });
});

// API routes
app.use('/api/movies', movieRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;