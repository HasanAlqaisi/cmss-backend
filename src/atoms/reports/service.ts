import prisma from "../../prisma";

export default class ReportService {
  static getReports = async (classId: number) => {
    const reports = await prisma.attendance.findMany({
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
    return reports;
  };
}
