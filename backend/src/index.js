// const express = require("express");          // using import-export functionality instead, by using  "type": "module" instead of "type": "commonjs", in package.json
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
// const app  = express();          // don't need this now, importing from socket.js

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());        // used to create JSON web token (JWT) to extract data from user in JSON format
app.use(cookieParser());
const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? "http://localhost:3000" : "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Static file serving is handled by Nginx in production

/* app.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    connectDB();
}); */

server.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    connectDB();
});