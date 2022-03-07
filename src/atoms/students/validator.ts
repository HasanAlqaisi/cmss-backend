import { Gender } from "@prisma/client";
import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertStudent = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    age: z.number().optional(),
    gender: z.nativeEnum(Gender).optional(),
    email: z.string().email().optional(),
    channelId: z.number(),
    classId: z.number(),
    highSchoolYearRange: z.string(),
  });

  return schema.parseAsync(req.body);
};
