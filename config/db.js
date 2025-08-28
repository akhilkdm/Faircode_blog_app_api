const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    console.log("uri---", uri);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
