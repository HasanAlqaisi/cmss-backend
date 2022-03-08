import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const getWarnings = async (req: Request) => {
  const schema = z.object({
    classId: z.string().transform((value) => Number(value)),
  });

  return schema.parseAsync(req.params);
};
