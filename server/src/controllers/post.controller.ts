import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const createNewPost = async (req: Request, res: Response) => {
  try {
    const {
      content,
      location,
      replyTo,
    }: {
      content: string;
      location: {
        city: string;
        country: string;
      } | null;
      replyTo: string | null;
    } = req.body;

    const user = jwt.verify(req.cookies.session, JWT_SECRET) as {
      email: string;
      exp: number;
      iat: number;
    };

    const tags: string[] = [];

    content.split(" ").forEach((word) => {
      if (word.startsWith("#")) {
        tags.push(word.substring(1));
      }
    });

    await prisma.post
      .create({
        data: {
          content: content,
          email: user.email,
          city: location !== null ? location.city : null,
          country: location !== null ? location.country : null,
        },
      })
      .then(async (newPost) => {
        if (replyTo) {
          await prisma.post.update({
            where: {
              id: newPost.id,
            },
            data: {
              replyTo: {
                connect: {
                  id: replyTo,
                },
              },
            },
          });
        }
        if (tags) {
          await Promise.all(
            tags.map((tag: string) => {
              console.log(tag);
              return prisma.tag.upsert({
                where: {
                  name: tag,
                },
                update: {
                  posts: {
                    connect: {
                      id: newPost.id,
                    },
                  },
                },
                create: {
                  name: tag,
                  posts: {
                    connect: {
                      id: newPost.id,
                    },
                  },
                },
              });
            })
          );
        }
      });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const user = jwt.verify(req.cookies.session, JWT_SECRET) as {
      email: string;
      exp: number;
      iat: number;
    };

    const { postId } = req.body;

    await prisma.like
      .create({
        data: {
          postId: postId,
          email: user.email,
        },
      })
      .catch(async (e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            await prisma.like.delete({
              where: {
                email_postId: {
                  email: user.email,
                  postId: postId,
                },
              },
            });
          }
        } else {
          throw e;
        }
      });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const fetchPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const user = jwt.verify(req.cookies.session, JWT_SECRET) as {
      email: string;
      exp: number;
      iat: number;
    };

    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
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
        replyTo: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                username: true,
                avatar: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    const replies = await prisma.post.findMany({
      where: {
        replyTo: {
          id: postId,
        },
      },
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
      },
    });

    res.status(200).json({ success: true, post: post, replies: replies });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const {
      city,
      country,
    }: {
      city: string | null;
      country: string | null;
    } = req.body;

    const user = jwt.verify(req.cookies.session, JWT_SECRET) as {
      email: string;
      exp: number;
      iat: number;
    };

    const followsPosts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              email: user.email,
            },
          },
        },
      },
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
        replyTo: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                username: true,
                avatar: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ success: true, follows: followsPosts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};
