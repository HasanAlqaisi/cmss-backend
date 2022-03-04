import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertSpecialty = async (req: Request) => {
  const schema = z
    .object({
      name: z.string(),
      minAvg: z.number().positive(),
      isDependent: z.boolean().default(false),
      customPercentage: z.number().default(0),
    })
    .refine(
      (data) => {
        const condition1 = data.isDependent && data.customPercentage;
        const condition2 = !data.isDependent;

        return condition1 || condition2;
      },
      {
        path: ["customPercentage"],
        message: "You should enter customPercentage",
      }
    );

  return schema.parseAsync(req.body);
};
