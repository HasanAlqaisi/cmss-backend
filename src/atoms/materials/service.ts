import { Material } from "@prisma/client";
import prisma from "../../prisma";

export default class MaterialService {
  static getMaterials = async (specialtyId: number) => {
    const materials = await prisma.material.findMany({
      where: {
        specialtyId: !Number.isNaN(specialtyId) ? specialtyId : undefined,
      },
      include: { specialty: true },
    });
    return materials;
  };

  static createMaterial = async (
    name: string,
    specialtyId: number,
    customPercentage?: number
  ): Promise<Material> => {
    const material = await prisma.material.create({
      data: {
        name,
        customPercentage,
        specialty: { connect: { id: specialtyId } },
      },
      include: { specialty: true },
    });

    return material;
  };

  static deleteMaterial = async (id: number): Promise<void> => {
    await prisma.material.delete({ where: { id } });
  };

  static updateMaterial = async (
    id: number,
    name: string,
    specialtyId: number,
    customPercentage?: number
  ): Promise<Material> => {
    const material = await prisma.material.update({
      where: { id },
      data: {
        name,
        customPercentage,
        specialty: { connect: { id: specialtyId } },
      },
      include: { specialty: true },
    });

    return material;
  };
}
