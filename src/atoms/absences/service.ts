import { Prisma } from "@prisma/client";
import prisma from "../../prisma";

export default class AbsenceService {
  static getAbsences = async () => {
    const absences = await prisma.absence.findFirst();
    return absences!;
  };

  static updateAbsence = async (
    id: number,
    input: Prisma.AbsenceCreateInput
  ) => {
    const absence = await prisma.absence.update({
      where: { id },
      data: {
        firstWarning: input.firstWarning,
        secondWarning: input.secondWarning,
        thirdWarning: input.thirdWarning,
      },
    });

    return absence;
  };
}
