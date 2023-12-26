import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import authRouter from "./routes/authRouter";
import sessionRouter from "./routes/sessionRouter";
import onboardingRouter from "./routes/onboardingRouter";
import postRouter from "./routes/postRouter";
import { Request, Response } from "express";
import userRouter from "./routes/userRouter";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use("/auth", authRouter);
app.use("/session", sessionRouter);
app.use("/onboarding", onboardingRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.get("/ping", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Pong!" });
});

app.listen(5000, () => {
  console.log("Application started on port 5000!");
});
