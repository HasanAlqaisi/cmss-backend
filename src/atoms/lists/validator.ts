import { Prisma } from "@prisma/client";
import { Request } from "express";
import { z } from "zod";
import zodPositiveNumberForm from "../../utils/zod-positive-number-form";

// eslint-disable-next-line import/prefer-default-export
export const createList = async (req: Request) => {
  const schema = z.object({
    roomId: zodPositiveNumberForm(),
    responsibleId: zodPositiveNumberForm(),
    dateInUse: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date().optional()),
    items: z.array(
      z.object({
        name: z.string(),
        image: z.string().optional(),
        description: z.string().optional(),
        quantity: zodPositiveNumberForm(),
      })
    ),
  });

  return schema.parseAsync(req.body);
};

export const getLists = async (req: Request) => {
  const schema = z.object({
    responsible: z.string().optional(),
    room: z.string().optional(),
    order: z.nativeEnum(Prisma.SortOrder).default("asc"),
  });

  return schema.parseAsync(req.query);
};
