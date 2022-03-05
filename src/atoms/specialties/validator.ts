import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertSpecialty = async (req: Request) => {
  const mainFields = z.object({
    name: z.string(),
    minAvg: z.number().positive(),
  });

  const independentSpecialty = z
    .object({
      isDependent: z.literal(false),
    })
    .and(mainFields);

  const dependentSpecialty = z
    .object({
      isDependent: z.literal(true),
      customPercentage: z.number().positive(),
    })
    .and(mainFields);

  const schema = independentSpecialty.or(dependentSpecialty);

  return schema.parseAsync(req.body);
};
