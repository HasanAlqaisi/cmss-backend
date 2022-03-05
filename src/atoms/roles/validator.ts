import { Table } from "@prisma/client";
import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertRole = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    permissions: z
      .array(
        z.object({
          action: z.enum(["create", "read", "update", "delete", "manage"]),
          subject: z.nativeEnum(Table),
          conditions: z.any().optional(),
        })
      )
      .optional(),
  });

  return schema.parseAsync(req.body);
};
