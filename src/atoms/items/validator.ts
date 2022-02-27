import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
// export const createList = async (req: Request) => {
//   const schema = z.object({
//     roomId: z.number(),
//     responsibleId: z.number(),
//     orderImage: z.any(),
//     items: z.array(
//       z.object({
//         itemId: z.number(),
//         quantity: z.number().positive(),
//       })
//     ),
//   });

//   return schema.parseAsync(req.body);
// };

// eslint-disable-next-line import/prefer-default-export
export const upsertItem = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    quantity: z.number().positive(),
    description: z.string().optional(),
    categoryId: z.number().optional(),
    date: z.date().optional(),
  });

  return schema.parseAsync(req.body);
};

export const itemType = async (req: Request) => {
  const schema = z.object({
    exported: z.string().optional(),
    broken: z.string().optional(),
  });

  return schema.parseAsync(req.query);
};
