import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { COOKIE_OPTIONS } from "../lib/cookieOptions";
import sgMail from "@sendgrid/mail";

const JWT_SECRET = process.env.JWT_SECRET || "";
const CLIENT_URL = process.env.CLIENT_URL || "";
const SESSION_EXPIRY = process.env.SESSION_EXPIRY || "";
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "";

const prisma = new PrismaClient();

export const enterEmail = async (req: Request, res: Response) => {
  try {
    const verificationToken = jwt.sign({ email: req.body.email }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
    const msg = {
      to: req.body.email,
      from: "xeolpost@gmail.com",
      subject: "Verify your email",
      text: "and easy to do anywhere, even with Node.js",
      html: CLIENT_URL + "/verify/" + verificationToken,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
    })
      .catch((error) => {
        console.error(error);
      });
    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const verificationToken = req.params.id;

    if (!verificationToken)
      return res.status(400).json({
        success: false,
        message: "Error verifying link. Please try again.",
      });

    const userId = jwt.verify(verificationToken, JWT_SECRET) as {
      email: string;
      iat: number;
      exp: number;
    };

    if (Date.now() >= userId.exp * 1000)
      return res.status(401).json({ success: false, message: "Token Expired" });

    const user = await prisma.user.upsert({
      where: {
        email: userId.email,
      },
      update: {},
      create: {
        email: userId.email,
      },
    });

    const sessionToken = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: SESSION_EXPIRY,
    });

    return res
      .cookie("session", sessionToken, COOKIE_OPTIONS)
      .status(200)
      .json({ success: true, message: "The link was successfully Verified!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error verifying link. Please try again.",
    });
  }
};
