import { Specialty } from "@prisma/client";
import prisma from "../../prisma";

export default class SpecialtyService {
  static getSpecialties = async (): Promise<Specialty[]> => {
    const specialty = await prisma.specialty.findMany();
    return specialty;
  };

  static createSpecialty = async (
    name: string,
    capacity: number
  ): Promise<Specialty> => {
    const specialty = await prisma.specialty.create({
      data: {
        name,
        capacity,
      },
    });

    return specialty;
  };

  static deleteSpecialty = async (id: number): Promise<void> => {
    await prisma.specialty.delete({ where: { id } });
  };

  static updateSpecialty = async (
    id: number,
    name: string,
    capacity: number
  ): Promise<Specialty> => {
    const specialty = await prisma.specialty.update({
      where: { id },
      data: { name, capacity },
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
