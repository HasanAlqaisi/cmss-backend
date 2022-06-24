import { Applicant } from "@prisma/client";
import prisma from "../../prisma";
import { reshapeDegreesForUpdate } from "./helpers";
import { InputApplicant } from "./types";

export default class ApplicantService {
  static getApplicants = async (channelId?: number, name?: string) => {
    const applicants = await prisma.applicant.findMany({
      orderBy: { average: "desc" },
      where: {
        channel: { id: !Number.isNaN(channelId) ? channelId : undefined },
        name: { search: name?.split(" ").join(" & ") },
      },
      include: {
        year: true,
        specialty: true,
        degrees: { include: { material: true } },
        channel: true,
        selectedBranches: {
          include: { branch: true },
          orderBy: { priority: "asc" },
        },
        acceptedBranch: true,
      },
    });
    return applicants;
  };

  static getApplicant = async (id: number) => {
    const applicants = await prisma.applicant.findUnique({
      where: { id },
      include: {
        year: true,
        specialty: true,
        degrees: { include: { material: true } },
        channel: true,
        selectedBranches: {
          include: { branch: true },
          orderBy: { priority: "asc" },
        },
        acceptedBranch: true,
      },
    });
    return applicants;
  };

  static searchForApplicant = async (query: string) => {
    const applicants = await prisma.applicant.findMany({
      where: { name: { search: query?.split(" ").join(" & ") } },
      include: {
        year: true,
        specialty: true,
        degrees: { include: { material: true } },
        channel: true,
        selectedBranches: { include: { branch: true } },
      },
    });
    return applicants;
  };

  static createApplicant = async (
    inputApplicant: InputApplicant,
    branches: { branch: { connect: { id: number } }; priority: number }[]
  ) => {
    if (inputApplicant.acceptedBranch !== undefined) {
      const applicant = await prisma.applicant.create({
        data: {
          name: inputApplicant.name,
          channel: { connect: { id: inputApplicant.channelId } },
          year: {
            connectOrCreate: {
              where: { range: inputApplicant.highSchoolYearRange },
              create: { range: inputApplicant.highSchoolYearRange },
            },
          },
          acceptedBranch: { connect: { id: inputApplicant.acceptedBranch } },
          specialty: { connect: { id: inputApplicant.specialtyId } },
          daor: inputApplicant.daor,
          age: inputApplicant.age,
          totalDegree: inputApplicant.totalDegree,
          average: inputApplicant.average,
          schoolName: inputApplicant.schoolName,
          gender: inputApplicant.gender,
          email: inputApplicant.email,
          city: inputApplicant.city,
          moderia: inputApplicant.moderia,
          examNumber: inputApplicant.examNumber,
          nationalId: inputApplicant.nationalId,
          religion: inputApplicant.religion,
          selectedBranches: {
            create: branches,
          },
          degrees: { createMany: { data: inputApplicant.degrees } },
        },
        include: {
          year: true,
          specialty: true,
          degrees: { include: { material: true } },
          channel: true,
          selectedBranches: { include: { branch: true } },
        },
      });
      return applicant;
    }
    const applicant = await prisma.applicant.create({
      data: {
        name: inputApplicant.name,
        channel: { connect: { id: inputApplicant.channelId } },
        year: {
          connectOrCreate: {
            where: { range: inputApplicant.highSchoolYearRange },
            create: { range: inputApplicant.highSchoolYearRange },
          },
        },
        specialty: { connect: { id: inputApplicant.specialtyId } },
        daor: inputApplicant.daor,
        age: inputApplicant.age,
        totalDegree: inputApplicant.totalDegree,
        average: inputApplicant.average,
        schoolName: inputApplicant.schoolName,
        gender: inputApplicant.gender,
        email: inputApplicant.email,
        city: inputApplicant.city,
        moderia: inputApplicant.moderia,
        examNumber: inputApplicant.examNumber,
        nationalId: inputApplicant.nationalId,
        religion: inputApplicant.religion,
        selectedBranches: {
          create: branches,
        },
        degrees: { createMany: { data: inputApplicant.degrees } },
      },
      include: {
        year: true,
        specialty: true,
        degrees: { include: { material: true } },
        channel: true,
        selectedBranches: { include: { branch: true } },
      },
    });
    return applicant;
  };

  static deleteApplicant = async (id: number): Promise<void> => {
    await prisma.applicant.delete({ where: { id } });
  };

  static deleteApplicantsForChannel = async (
    channelId: number
  ): Promise<void> => {
    await prisma.applicant.deleteMany({
      where: { channel: { id: channelId } },
    });
  };

  static deleteApplicants = async (): Promise<void> => {
    await prisma.applicant.deleteMany();
  };

  static updateApplicant = async (
    id: number,
    inputApplicant: InputApplicant,
    branches: { branch: { connect: { id: number } }; priority: number }[]
  ): Promise<Applicant> => {
    const reshapedDegrees = reshapeDegreesForUpdate(inputApplicant);
    if (inputApplicant.acceptedBranch !== undefined) {
      const applicant = await prisma.applicant.update({
        where: { id },
        data: {
          name: inputApplicant.name,
          channel: { connect: { id: inputApplicant.channelId } },
          year: {
            connectOrCreate: {
              where: { range: inputApplicant.highSchoolYearRange },
              create: { range: inputApplicant.highSchoolYearRange },
            },
          },
          acceptedBranch: { connect: { id: inputApplicant.acceptedBranch } },
          specialty: { connect: { id: inputApplicant.specialtyId } },
          daor: inputApplicant.daor,
          age: inputApplicant.age,
          totalDegree: inputApplicant.totalDegree,
          average: inputApplicant.average,
          schoolName: inputApplicant.schoolName,
          gender: inputApplicant.gender,
          email: inputApplicant.email,
          city: inputApplicant.city,
          moderia: inputApplicant.moderia,
          examNumber: inputApplicant.examNumber,
          nationalId: inputApplicant.nationalId,
          religion: inputApplicant.religion,
          selectedBranches: {
            deleteMany: {},
            create: branches,
          },
          degrees: {
            deleteMany: {},
            create: reshapedDegrees,
          },
        },
        include: {
          year: true,
          specialty: true,
          degrees: { include: { material: true } },
          channel: true,
          selectedBranches: { include: { branch: true } },
        },
      });

      return applicant;
    }

    const applicant = await prisma.applicant.update({
      where: { id },
      data: {
        name: inputApplicant.name,
        channel: { connect: { id: inputApplicant.channelId } },
        year: {
          connectOrCreate: {
            where: { range: inputApplicant.highSchoolYearRange },
            create: { range: inputApplicant.highSchoolYearRange },
          },
        },
        specialty: { connect: { id: inputApplicant.specialtyId } },
        daor: inputApplicant.daor,
        age: inputApplicant.age,
        totalDegree: inputApplicant.totalDegree,
        average: inputApplicant.average,
        schoolName: inputApplicant.schoolName,
        gender: inputApplicant.gender,
        email: inputApplicant.email,
        city: inputApplicant.city,
        moderia: inputApplicant.moderia,
        examNumber: inputApplicant.examNumber,
        nationalId: inputApplicant.nationalId,
        religion: inputApplicant.religion,
        selectedBranches: {
          deleteMany: {},
          create: branches,
        },
        degrees: {
          deleteMany: {},
          create: reshapedDegrees,
        },
      },
      include: {
        year: true,
        specialty: true,
        degrees: { include: { material: true } },
        channel: true,
        selectedBranches: { include: { branch: true } },
      },
    });

    return applicant;
  };

  static updateTotalAndAvgForApplicant = async (
    applicantId: number,
    average: number,
    totalDegree: number
  ) => {
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { average, totalDegree },
    });
  };
}
