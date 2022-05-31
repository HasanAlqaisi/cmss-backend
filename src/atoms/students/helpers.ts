import { Channel, Class, Student, Year } from "@prisma/client";
import { GetAttendancesType } from "../attendances/service";
import { GetStudentsType } from "./service";

// eslint-disable-next-line import/prefer-default-export
export const reshapeStudentsWithAttendances = (
  attendances: GetAttendancesType,
  students: GetStudentsType
): {
  student: Student & {
    Class: Class;
    channel: Channel;
    year: Year;
  };
  attendend: boolean;
}[] => {
  let result: {
    student: Student & {
      Class: Class;
      channel: Channel;
      year: Year;
    };
    attendend: boolean;
  }[] = [];

  result = [];

  const date = new Date();

  // eslint-disable-next-line no-restricted-syntax
  for (const student of students) {
    const attendance = attendances.find(
      (attend) =>
        attend.student.id === student.id &&
        attend.date.getDay() === date.getDay()
    );

    if (attendance) {
      result.push({ student, attendend: attendance?.attended || false });
    }
  }

  return result;
};
