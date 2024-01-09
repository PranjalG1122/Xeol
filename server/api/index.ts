import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import authRouter from "../src/routes/authRouter";
import sessionRouter from "../src/routes/sessionRouter";
import onboardingRouter from "../src/routes/onboardingRouter";
import postRouter from "../src/routes/postRouter";
import { Request, Response } from "express";
import userRouter from "../src/routes/userRouter";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use("/api/auth", authRouter);
app.use("/api/session", sessionRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);

app.get("/api", (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
});

app.listen(5000, () => {
  console.log("Application started on port 5000!");
});
