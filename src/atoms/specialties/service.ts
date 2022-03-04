import { Specialty } from "@prisma/client";
import prisma from "../../prisma";
import { InputSpecialty } from "./types";

export default class SpecialtyService {
  static getSpecialties = async (): Promise<Specialty[]> => {
    const specialty = await prisma.specialty.findMany();
    return specialty;
  };

  static createSpecialty = async (
    inputSpecialty: InputSpecialty
  ): Promise<Specialty> => {
    const specialty = await prisma.specialty.create({
      data: {
        name: inputSpecialty.name,
        minAvg: inputSpecialty.minAvg,
        isDependent: inputSpecialty.isDependent,
        customPercentage: inputSpecialty.customPercentage,
      },
    });

    return specialty;
  };

  static deleteSpecialty = async (id: number): Promise<void> => {
    await prisma.specialty.delete({ where: { id } });
  };

  static updateSpecialty = async (
    id: number,
    inputSpecialty: InputSpecialty
  ): Promise<Specialty> => {
    const specialty = await prisma.specialty.update({
      where: { id },
      data: {
        name: inputSpecialty.name,
        minAvg: inputSpecialty.minAvg,
        isDependent: inputSpecialty.isDependent,
        customPercentage: inputSpecialty.customPercentage,
      },
    });

    return specialty;
  };

  static calculateMaterialCountsForSpecialty = async (specialtyId: number) => {
    // Calculate how many materials are there in this specialty
    // Without materials have percentage not euqal 0
    const queryCount = await prisma.$queryRaw<
      { count: number }[]
    >`SELECT COUNT("id") FROM "Material" WHERE "specialtyId" = ${specialtyId} AND "customPercentage" = 0`;

    return queryCount;
  };
}
