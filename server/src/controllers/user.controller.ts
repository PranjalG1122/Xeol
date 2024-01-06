import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const fetchUser = async (req: Request, res: Response) => {
  try {
    const username = req.params.id;

    const user = jwt.verify(req.cookies.session, JWT_SECRET) as {
      email: string;
      exp: number;
      iat: number;
    };

    const userDetails = await prisma.user.findUniqueOrThrow({
      where: {
        username: username,
      },
      select: {
        avatar: true,
        createdAt: true,
        description: true,
        username: true,
        name: true,
        posts: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            city: true,
            country: true,
            user: {
              select: {
                username: true,
                avatar: true,
                name: true,
              },
            },
            likes: {
              where: {
                email: user.email,
              },
              select: {
                email: true,
              },
            },
            _count: {
              select: {
                likes: true,
                replies: true,
              },
            },
            replyTo: {
              select: {
                id: true,
                createdAt: true,
                content: true,
                user: {
                  select: {
                    username: true,
                    avatar: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            posts: true,
            followers: true,
            follows: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      userDetails,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const username = req.params.id;

    const user = jwt.verify(req.cookies.session, JWT_SECRET) as {
      email: string;
      exp: number;
      iat: number;
    };

    if (username === user.email) {
      throw new Error("You can't follow yourself");
    }

    await prisma.user
      .findUniqueOrThrow({
        where: {
          email: user.email,
        },
        select: {
          follows: {
            where: {
              username: username,
            },
          },
        },
      })
      .then(async (res) => {
        if (res.follows.length > 0) {
          await prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              follows: {
                disconnect: {
                  username: username,
                },
              },
            },
            select: {
              follows: true,
            },
          });
        } else {
          await prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              follows: {
                connect: {
                  username: username,
                },
              },
            },
            select: {
              follows: true,
            },
          });
        }
      });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const fetchUserFollowers = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const followers = await prisma.user.findUniqueOrThrow({
      where: {
        username: username,
      },
      select: {
        name: true,
        username: true,
        followers: {
          select: {
            username: true,
            avatar: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      follow: {
        name: followers.name,
        username: followers.username,
        follow: followers.followers,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const fetchUserFollows = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const follows = await prisma.user.findUniqueOrThrow({
      where: {
        username: username,
      },
      select: {
        name: true,
        username: true,
        follows: {
          select: {
            username: true,
            avatar: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      follow: {
        name: follows.name,
        username: follows.username,
        follow: follows.follows,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};
