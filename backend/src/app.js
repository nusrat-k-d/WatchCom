import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'WatchCom API is running' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'WatchCom Backend Running 🚀',
  });
});

export default app;