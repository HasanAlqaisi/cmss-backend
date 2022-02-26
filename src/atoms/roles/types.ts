import { Permission, Prisma, Table } from "@prisma/client";

// const roleWithPermissions = Prisma.validator<Prisma.RoleArgs>()({
//   include: { permissions: true },
// });

// export type RoleWithPermissions = Prisma.RoleGetPayload<
//   typeof roleWithPermissions
// >;

type CustomPermission = {
  action: string;
  subject: Table;
  conditions?: Prisma.JsonObject;
};

export type RoleWithPermissions = {
  roleName: string;
  permissions?: CustomPermission[];
};
