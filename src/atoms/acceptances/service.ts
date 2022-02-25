import prisma from "../../prisma";

export default class AcceptancesService {
  static acceptApplicant = async (applicantId: number, branchId: number) => {
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { acceptedBranch: { connect: { id: branchId } } },
    });
  };
}
