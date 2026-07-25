const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  // Set DNS servers to Google DNS to resolve MongoDB Atlas SRV records correctly
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (dnsErr) {
    console.warn("⚠️ Warning: Failed to set custom DNS servers:", dnsErr.message);
  }

  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not set. Skipping MongoDB connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("⚠️ MongoDB connection failed. The server will continue running.");
    console.error(error.message);
  }
};

module.exports = connectDB;