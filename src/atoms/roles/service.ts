import prisma from "../../prisma";
import { RoleWithPermissions } from "./types";

export default class RoleService {
  static getRoles = async () => {
    const roles = await prisma.role.findMany({
      include: { permissions: true },
    });
    return roles;
  };

  static createRole = async (data: RoleWithPermissions) => {
    const role = await prisma.role.create({
      data: {
        name: data.roleName,
        permissions:
          data.permissions !== undefined
            ? { createMany: { data: data.permissions } }
            : undefined,
      },
      include: { permissions: true },
    });

    return role;
  };

  static deleteRole = async (id: number): Promise<void> => {
    const deletePermissoins = prisma.role.update({
      where: { id },
      data: { permissions: { deleteMany: {} } },
    });
    const deleteRoles = prisma.role.delete({ where: { id } });

    await prisma.$transaction([deletePermissoins, deleteRoles]);
  };

  static updateRole = async (id: number, data: RoleWithPermissions) => {
    const role = await prisma.role.update({
      where: { id },
      data: {
        name: data.roleName,
        permissions:
          data.permissions !== undefined
            ? { deleteMany: {}, createMany: { data: data.permissions } }
            : undefined,
      },
      include: { permissions: true },
    });

    return role;
  };
}
