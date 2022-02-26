import { Prisma } from "@prisma/client";

const userWithPermissions = Prisma.validator<Prisma.UserArgs>()({
  include: { role: { include: { permissions: true } } },
});

export type UserWithPermissions = Prisma.UserGetPayload<
  typeof userWithPermissions
>;
