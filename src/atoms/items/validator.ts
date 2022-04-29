import { Prisma } from "@prisma/client";
import { Request } from "express";
import { z } from "zod";
import zodPositiveNumberForm from "../../utils/zod-positive-number-form";

export const upsertItem = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    quantity: zodPositiveNumberForm(),
    description: z.string().optional(),
    categoryId: zodPositiveNumberForm().optional(),
    date: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date().optional()),
  });

  return schema.parseAsync(req.body);
};

const fields = {
  exported: z.string().optional(),
  broken: z.string().optional(),
};

export const itemQuery = async (req: Request) => {
  const schema = z.object({
    exported: fields.exported,
    broken: fields.broken,
  });

  return schema.parseAsync(req.query);
};

export const itemsQuery = async (req: Request) => {
  const schema = z.object({
    exported: fields.exported,
    broken: fields.broken,
    name: z.string().optional(),
    categoryId: z.string().optional(),
    order: z.nativeEnum(Prisma.SortOrder).default("asc"),
  });

  return schema.parseAsync(req.query);
};
