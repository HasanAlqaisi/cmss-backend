import { Prisma } from "@prisma/client";

export type FullWarning = {
  id: number;
  name: string;
  email: string;
  lectures: { id: number; name: string; absence: number }[];
};

const warningAndLecture = Prisma.validator<Prisma.AttendanceArgs>()({
  select: {
    student: { select: { name: true, email: true, id: true } },
    lecture: {
      select: {
        id: true,
        hall: { select: { subject: { select: { name: true } } } },
      },
    },
  },
});

export type WarningAndLecture = Prisma.AttendanceGetPayload<
  typeof warningAndLecture
>;
