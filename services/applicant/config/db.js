const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  
    const uri = process.env.MONGODB_URI;
    await mongoose
      .connect(uri , console.log('MongoDB connected'))
      .then(() => console.log('MongoDB connected'))
      .catch((err) => console.error('MongoDB connection error:', err.message));
};
module.exports = connectDB;