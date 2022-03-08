import prisma from "../../prisma";

export default class WarningService {
  static getWarnings = async (classId: number) => {
    const warnings = await prisma.attendance.findMany({
      where: { attended: false, student: { classId } },
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
    return warnings;
  };
}
