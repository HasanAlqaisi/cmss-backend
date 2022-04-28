import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const getSchedules = async (req: Request) => {
  const schema = z.object({
    programId: z.string().optional(),
  });

  return schema.parseAsync(req.query);
};
