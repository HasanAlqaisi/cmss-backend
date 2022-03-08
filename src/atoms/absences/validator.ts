import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const updateAbsence = async (req: Request) => {
  const schema = z.object({
    firstWarning: z.number(),
    secondWarning: z.number(),
    thirdWarning: z.number(),
  });

  return schema.parseAsync(req.body);
};
