import { Prisma, Table } from "@prisma/client";

type CustomPermission = {
  action: string;
  subject: Table;
  conditions?: Prisma.JsonObject;
};

export type RoleWithPermissions = {
  name: string;
  permissions?: CustomPermission[];
};
