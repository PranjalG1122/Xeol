import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

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

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const { name, description, avatar } = req.body;

    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: "image/png" });

      const avatarURL: string = await new Promise(async (resolve) => {
        cloudinary.uploader
          .upload_stream((error, uploadResult) => {
            if (error) return res.status(500).json({ success: false });
            return resolve(uploadResult);
          })
          .end(new Uint8Array(await blob.arrayBuffer()));
      }).then((uploadResult: any) => {
        return uploadResult.secure_url;
      });

      const updatedDetails = await prisma.user.update({
        where: {
          email: sessionToken.email,
        },
        data: {
          name: name,
          avatar: avatarURL,
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
    return res.status(500).json({ success: false });
  }
};
