import { Request } from "express";
import { z } from "zod";

export const createRoom = async (req: Request) => {
  const schema = z.object({
    number: z.number(),
    name: z.string().optional(),
  });

  return schema.parseAsync(req.body);
};

export const updateRoom = async (req: Request) => {
  const schema = z.object({
    number: z.number(),
    name: z.string(),
  });

  return schema.parseAsync(req.body);
};
