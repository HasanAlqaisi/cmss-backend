import { Request } from "express";
import { z } from "zod";

export const lectureQuery = async (req: Request) => {
  const schema = z.object({
    classId: z.string().optional(),
    teacherId: z.string().optional(),
  });

  return schema.parseAsync(req.query);
};

export const createLecture = async (req: Request) => {
  const schema = z.object({
    teacherId: z.number(),
    roomId: z.number(),
    subjectId: z.number(),
  });

  return schema.parseAsync(req.body);
};

export const updateLecture = async (req: Request) => {
  const schema = z.object({
    teacherId: z.number(),
    roomId: z.number(),
    subjectId: z.number(),
  });

  return schema.parseAsync(req.body);
};
