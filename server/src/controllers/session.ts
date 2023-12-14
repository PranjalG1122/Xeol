import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

const prisma = new PrismaClient();

export const checkSession = async (req: Request, res: Response) => {
  try {
    const session = req.cookies.session;
    if (!session) return res.status(401).json({ success: false });

    const sessionToken = jwt.verify(session, JWT_SECRET) as {
      email: string;
      iat: number;
      exp: number;
    };

    if (!sessionToken) return res.status(401).json({ success: false });

    const onBoarded = await prisma.user.findUniqueOrThrow({
      where: {
        email: sessionToken.email,
      },
      select: {
        onboarded: true,
      },
    });

    return res.status(200).json({ success: true, data: onBoarded });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};
