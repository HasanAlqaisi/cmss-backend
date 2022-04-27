import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const updateStage = async (req: Request) => {
  const schema = z.object({
    forbiddenDays: z.array(z.number().nonnegative()),
  });

  return schema.parseAsync(req.body);
};
