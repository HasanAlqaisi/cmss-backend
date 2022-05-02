import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertBranch = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    maxCapacity: z.number().positive(),
  });

  return schema.parseAsync(req.body);
};
