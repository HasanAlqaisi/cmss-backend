import { Gender, Prisma } from "@prisma/client";

export type InputApplicant = {
  name: string;
  channelId: number;
  daor: number;
  highSchoolYearRange: string;
  specialtyId: number;
  degrees: { materialId: number; score: number }[];
  totalDegree?: number;
  average?: number;
  acceptedBranch?: number;
  note?: string;
  age?: number;
  schoolName?: string;
  gender?: Gender;
  email?: string;
  city?: string;
  moderia?: string;
  examNumber?: string;
  nationalId?: string;
  religion?: string;
};

// const applicant = Prisma.validator<Prisma.ApplicantArgs>()({
//   include: { degrees: true, acceptedBranch: true, year: true },
// });

// export type InputApplicant = Prisma.ApplicantGetPayload<typeof applicant>;
