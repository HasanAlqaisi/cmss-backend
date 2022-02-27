import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertCategory = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
  });

  return schema.parseAsync(req.body);
};
