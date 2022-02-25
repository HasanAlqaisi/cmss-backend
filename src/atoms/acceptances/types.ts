import { Prisma } from "@prisma/client";
import ApplicantService from "../applicants/service";

export type FullApplicant = Prisma.PromiseReturnType<
  typeof ApplicantService.createApplicant
>;
