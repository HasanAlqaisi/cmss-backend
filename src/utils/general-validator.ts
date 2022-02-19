import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const id = async (req: Request) => {
  const schema = z.object({
    id: z.string(),
  });
  return schema.parseAsync(req.params);
};
