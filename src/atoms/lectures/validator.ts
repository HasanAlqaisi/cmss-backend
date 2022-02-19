import { Request } from "express";
import { z } from "zod";

export const createLecture = async (req: Request) => {
  const schema = z.object({
    teacher_id: z.number(),
    room_id: z.number(),
    subject_id: z.number(),
  });

  return schema.parseAsync(req.body);
};

export const updateLecture = async (req: Request) => {
  const schema = z.object({
    teacher_id: z.number(),
    room_id: z.number(),
    subject_id: z.number(),
  });

  return schema.parseAsync(req.body);
};
