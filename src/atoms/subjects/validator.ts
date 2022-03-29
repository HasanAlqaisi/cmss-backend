import { Request } from "express";
import { z } from "zod";

export const getSubjects = async (req: Request) => {
  const schema = z.object({
    classId: z.string().optional(),
  });

  return schema.parseAsync(req.query);
};

export const createSubject = async (req: Request) => {
  const schema = z.object({
    classId: z.number(),
    name: z.string(),
    isElectronic: z.boolean(),
    isLab: z.boolean(),
  });

  return schema.parseAsync(req.body);
};

export const updateSubject = async (req: Request) => {
  const schema = z.object({
    classId: z.number(),
    name: z.string(),
    isElectronic: z.boolean(),
    isLab: z.boolean(),
  });

  return schema.parseAsync(req.body);
};
