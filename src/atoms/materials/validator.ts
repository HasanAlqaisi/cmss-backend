import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertMaterial = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    custom_percentage: z.number().nonnegative().default(0),
    specialty_id: z.number(),
  });

  return schema.parseAsync(req.body);
};

export const getMaterials = async (req: Request) => {
  const schema = z.object({
    specialtyId: z.string().optional(),
  });
  return schema.parseAsync(req.query);
};
