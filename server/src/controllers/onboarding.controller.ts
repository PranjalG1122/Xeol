import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import express from "express";
import { put } from "@vercel/blob";

const JWT_SECRET = process.env.JWT_SECRET || "";

const prisma = new PrismaClient();

export const verifyUsername = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    if (!username) return res.status(404).json({ success: false });

    const usernameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!usernameExists) return res.status(200).json({ success: true });

    return res.status(200).json({ success: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const updateOnboarding = async (req: Request, res: Response) => {
  try {
    const session = req.cookies.session;
    const sessionToken = jwt.verify(session, JWT_SECRET) as {
      email: string;
      iat: number;
      exp: number;
    };

    const { name, username, description } = req.body;

    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: "image/png" });

      const returnBlob = await put("avatar.png", blob, {
        access: "public",
        contentType: "image/png",
      });

      await prisma.user.update({
        where: {
          email: sessionToken.email,
        },
        data: {
          name: name,
          avatar: returnBlob.url,
          username: username,
          description: description,
          onboarded: true,
        },
      });

      return res.status(200).json({ success: true });
    }

    await prisma.user.update({
      where: {
        email: sessionToken.email,
      },
      data: {
        name: name,
        username: username,
        description: description,
        onboarded: true,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(501).json({ success: false });
  }
};
