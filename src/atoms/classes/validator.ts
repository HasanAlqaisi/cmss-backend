import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const insertClass = async (req: Request) => {
  const schema = z.object({
    branchId: z.number().positive(),
    stageId: z.number().positive(),
    programId: z.number().positive(),
  });

  return schema.parseAsync(req.body);
};
