import { Prisma } from "@prisma/client";
import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const createList = async (req: Request) => {
  const schema = z.object({
    roomId: z.number(),
    responsibleId: z.number(),
    dateInUse: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date().optional()),
    items: z.array(
      z.object({
        name: z.string(),
        image: z.string().optional(),
        description: z.string().optional(),
        quantity: z.number().positive(),
      })
    ),
  });

  return schema.parseAsync(req.body);
};

export const getLists = async (req: Request) => {
  const schema = z.object({
    responsible: z.number().optional(),
    room: z.number().optional(),
    order: z.nativeEnum(Prisma.SortOrder).default("asc"),
  });

  return schema.parseAsync(req.query);
};
