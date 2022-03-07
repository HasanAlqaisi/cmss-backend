import { Gender } from "@prisma/client";

export type InputStudent = {
  name: string;
  age?: number;
  gender?: Gender;
  email?: string;
  highSchoolYearRange: string;
  channelId: number;
  classId: number;
};
