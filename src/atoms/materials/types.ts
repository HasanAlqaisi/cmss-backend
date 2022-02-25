import { Prisma } from "@prisma/client";

const materialsWithSpecialties = Prisma.validator<Prisma.MaterialArgs>()({
  include: { specialty: true },
});

export type MaterialsWithSpecialties = Prisma.MaterialGetPayload<
  typeof materialsWithSpecialties
>;
