import { Request } from "express";
import { z } from "zod";

export const getSubjects = async (req: Request) => {
  const schema = z.object({
    class_id: z.string().optional(),
  });

  return schema.parseAsync(req.query);
};

export const createSubject = async (req: Request) => {
  const schema = z.object({
    class_id: z.number(),
    name: z.string(),
    is_electronic: z.boolean(),
    is_lab: z.boolean(),
  });

  return schema.parseAsync(req.body);
};

export const updateSubject = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    is_electronic: z.boolean(),
    is_lab: z.boolean(),
  });

  return schema.parseAsync(req.body);
};
