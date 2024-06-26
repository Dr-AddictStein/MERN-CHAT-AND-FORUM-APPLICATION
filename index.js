import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import connectDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import fileRouter from "./routes/file.routes.js"; // Adjust the path to match your file
import messageRoutes from "./routes/message.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import userRoutes from "./routes/user.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;
app.use('/uploads', express.static('uploads'));
const __dirname = path.resolve();
dotenv.config();

// database config
// mongoose
//   .connect(
//     "mongodb+srv://cseiubatgoswami:uDmzPkpFfVIJZgCU@cluster0.phluhf4.mongodb.net/chat-app-backend?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("Connection to database is successful");
//   })
//   .catch((e) => {
//     console.error("Failed to connect to database:", e.message);
//     process.exit(1); // terminate the application
//   });

connectDB();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(
  cors({
    origin: [
      "https://mern-chat-and-forum-app-frontend.onrender.com",
      "http://localhost:3000",
      "https://chat-and-fourm.netlify.app",
      "https://mern-chat-and-forum-app-frontend.vercel.app",
    ], // Replace with your deployed frontend URL
    credentials: true,
  })
);
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api", fileRouter);
app.use("/api/community/topics", topicRoutes);
app.use("/api/community/gallery", galleryRoutes);

app.use("/", (req, res) =>
  res.status(200).json({ success: true, msg: "server is running" })
);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  // connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
