const mongoose = require('mongoose');
const User = require('./user.model');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://eventzen-mongodb:27017/eventzen';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  User,
};
