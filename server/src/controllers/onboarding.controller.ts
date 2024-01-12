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
    const sessionToken = jwt.verify(req.cookies.session, JWT_SECRET) as {
      email: string;
      iat: number;
      exp: number;
    };

    const { name, description, avatar } = req.body;

    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: "image/png" });

      const returnBlob = await put("avatar.png", blob, {
        access: "public",
        contentType: "image/png",
      });

      const updatedDetails = await prisma.user.update({
        where: {
          email: sessionToken.email,
        },
        data: {
          name: name,
          avatar: returnBlob.url,
          description: description,
          onboarded: true,
        },
        select: {
          avatar: true,
          name: true,
          description: true,
        },
      });

      return res.status(200).json({ success: true, updatedDetails });
    }

    const updatedDetails = await prisma.user.update({
      where: {
        email: sessionToken.email,
      },
      data: {
        name: name,
        description: description,
        onboarded: true,
        avatar: avatar,
      },
      select: {
        avatar: true,
        name: true,
        description: true,
      },
    });

    return res.status(200).json({ success: true, updatedDetails });
  } catch (err) {
    console.error(err);
    return res.status(501).json({ success: false });
  }
};
