import { Request } from "express";
import { z } from "zod";

export const toggleAttendance = async (req: Request) => {
  const schema = z.object({
    lectureId: z.number(),
    studentId: z.number(),
    date: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date().optional()),
  });

  return schema.parseAsync(req.body);
};

export const startSessionAttendance = async (req: Request) => {
  const schema = z.object({
    lectureId: z.number(),
    classId: z.number(),
  });

  return schema.parseAsync(req.body);
};

export const upsertAttendance = async (req: Request) => {
  const schema = z.object({
    lectureId: z.number(),
    studentId: z.number(),
    note: z.string().optional(),
    date: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date().optional()),
    attended: z.boolean().default(false),
  });

  return schema.parseAsync(req.body);
};

export const getAttendances = async (req: Request) => {
  const schema = z.object({
    lectureId: z
      .string()
      .optional()
      .transform((id) => {
        if (id) {
          const idNumber = parseInt(id, 10);
          if (!Number.isNaN(idNumber)) {
            return idNumber;
          }
        }
        return undefined;
      }),
    studentId: z
      .string()
      .optional()
      .transform((id) => {
        if (id) {
          const idNumber = parseInt(id, 10);
          if (!Number.isNaN(idNumber)) {
            return idNumber;
          }
        }
        return undefined;
      }),
    date: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date().optional()),
  });

  return schema.parseAsync(req.query);
};
