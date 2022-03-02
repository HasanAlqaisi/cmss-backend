import { Prisma } from "@prisma/client";
import { Request } from "express";
import { isString } from "lodash";
import { unknown, z } from "zod";
import { BadRequestError } from "../../utils/api/api-error";
import logger from "../../utils/config/logger";

export const upsertItem = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    quantity: z
      .string()
      .refine(
        (value) => {
          const quantityNumber = parseInt(value, 10);
          return !Number.isNaN(quantityNumber);
        },
        { message: "is not a number" }
      )
      .refine(
        (value) => {
          const quantityNumber = parseInt(value, 10);
          return quantityNumber > 0;
        },
        {
          message: "should be greater than 0",
        }
      )
      .transform((value) => Number(value)),
    description: z.string().optional(),
    categoryId: z.number().optional(),
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
    order: z.nativeEnum(Prisma.SortOrder).default("asc"),
  });

  return schema.parseAsync(req.query);
};

export const roomItemsQuery = async (req: Request) => {
  const schema = z.object({
    name: z.string().optional(),
    order: z.nativeEnum(Prisma.SortOrder).default("asc"),
  });

  return schema.parseAsync(req.query);
};
