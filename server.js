require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { default: helmet } = require("helmet");

const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://faircode-blog-app-frontend-r2ncgetfl-akhilk-7746s-projects.vercel.app"
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());

console.log("env", process.env.MONGODB_URI, process.env.PORT);

connectDB(process.env.MONGODB_URI);

// routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/posts", require("./routes/post.route"));

app.get("/", (req, res) => res.send("Blog API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
