import dotenv from 'dotenv';
dotenv.config();

// console.log("TMDB_API_KEY:", process.env.TMDB_API_KEY);
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGODB_URI provided. Skipping database connection for now.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
