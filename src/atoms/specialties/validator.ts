import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertSpecialty = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    capacity: z.number().positive(),
    isDependent: z.boolean().default(false),
  });

  return schema.parseAsync(req.body);
};
