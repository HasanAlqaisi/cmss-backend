import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const computeAcceptances = async (req: Request) => {
  const schema = z.object({
    channelId: z.string(),
  });
  return schema.parseAsync(req.params);
};
