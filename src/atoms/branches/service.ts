import { Branch } from "@prisma/client";
import prisma from "../../prisma";

export default class BranchService {
  static getBranches = async (): Promise<Branch[]> => {
    const branches = await prisma.branch.findMany();
    return branches;
  };

  static countAcceptedApplicantsForEachBranch = async () => {
    const result = await prisma.branch.findMany({
      select: { id: true, _count: { select: { acceptedApplicants: true } } },
    });
    return result;
  };

  static createBranch = async (
    name: string,
    maxCapacity: number
  ): Promise<Branch> => {
    const branch = await prisma.branch.create({
      data: {
        name,
        maxCapacity,
      },
    });

    return branch;
  };

  static deleteBranch = async (id: number): Promise<void> => {
    await prisma.branch.delete({ where: { id } });
  };

  static updateBranch = async (
    id: number,
    name: string,
    maxCapacity: number
  ): Promise<Branch> => {
    const branch = await prisma.branch.update({
      where: { id },
      data: { name, maxCapacity },
    });

    return branch;
  };
}
