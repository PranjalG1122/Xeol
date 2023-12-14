import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import authRouter from "./routes/authRouter";
import sessionRouter from "./routes/sessionRouter";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use("/auth", authRouter);
app.use("/session", sessionRouter);

app.get("/ping", (req, res) => {
  res.status(200).json({ success: true, message: "Pong!" });
});

app.listen(5000, () => {
  console.log("Application started on port 5000!");
});
