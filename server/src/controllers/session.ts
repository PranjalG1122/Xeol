import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

const prisma = new PrismaClient();

export const checkSession = async (req: Request, res: Response) => {
  try {
    const session = req.cookies.session;

    const sessionToken = jwt.verify(session, JWT_SECRET) as {
      email: string;
      iat: number;
      exp: number;
    };

    const onBoarded = await prisma.user.findUniqueOrThrow({
      where: {
        email: sessionToken.email,
      },
      select: {
        onboarded: true,
      },
    });

    return res
      .status(200)
      .json({ verified: true, onboarded: onBoarded.onboarded });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ verified: false, onboarded: false });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const session = req.cookies.session;

    const sessionToken = jwt.verify(session, JWT_SECRET) as {
      email: string;
      iat: number;
      exp: number;
    };

    const userDetails = await prisma.user.findFirstOrThrow({
      where: {
        email: sessionToken.email,
      },
      select: {
        avatar: true,
        name: true,
        username: true,
      },
    });

    return res.status(200).json({ success: true, userDetails: userDetails });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};
