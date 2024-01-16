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
      subject: "Authenticate with Xeol",
      text: "Authenticate with Xeol",
      html: `
      <html>
  <head>
    <title>Verify your email</title>
  </head>
  <body
    style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    "
  >
    <h1>Authenticate your email</h1>
    <a href="${CLIENT_URL}/verify/${verificationToken}">Click here</a>
    <p>@Xeol 2024</p>
    <p>Created by Pranjal Gupta</p>
  </body>
</html>
`,
    };
    sgMail
      .send(msg)
      .then((data) => {
        return res.status(200).json({ success: true });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const verificationToken = req.params.id;

    if (!verificationToken) return res.status(400).json({ success: false });

    const userId = jwt.verify(verificationToken, JWT_SECRET) as {
      email: string;
      iat: number;
      exp: number;
    };

    if (Date.now() >= userId.exp * 1000)
      return res.status(401).json({ success: false });

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
      .json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
    });
  }
};
