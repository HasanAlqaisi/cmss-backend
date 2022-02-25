import { Gender } from "@prisma/client";
import { Request } from "express";
import { z } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const upsertApplicant = async (req: Request) => {
  const schema = z.object({
    name: z.string(),
    channelId: z.number(),
    daor: z.number(),
    highSchoolYearRange: z.string(),
    specialtyId: z.number(),
    selectedBranches: z.array(z.number()),
    degrees: z.array(
      z.object({
        materialId: z.number(),
        score: z.number().min(0).max(100),
      })
    ),
    totalDegree: z.number().optional(),
    average: z.number().optional(),
    acceptedBranch: z.number().optional(),
    age: z.number().optional(),
    note: z.string().optional(),
    schoolName: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    email: z.string().email().optional(),
    city: z.string().optional(),
    moderia: z.string().optional(),
    examNumber: z.string().optional(),
    nationalId: z.string().optional(),
    religion: z.string().optional(),
  });

  return schema.parseAsync(req.body);
};

export const getApplicants = async (req: Request) => {
  const schema = z.object({
    channelId: z.string().optional(),
    name: z.string().optional(),
  });
  return schema.parseAsync(req.query);
};

export const deleteApplicants = async (req: Request) => {
  const schema = z.object({
    channelId: z.string().optional(),
  });
  return schema.parseAsync(req.query);
};
