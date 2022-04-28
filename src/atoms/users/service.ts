import { User } from "@prisma/client";
import _ from "lodash";
import prisma from "../../prisma";
import { BadRequestError } from "../../utils/api/api-error";

export default class UserService {
  static createUser = async (
    username: string,
    fullName: string,
    roleId: number,
    email: string,
    hashedPass: string,
    roomId?: number
  ): Promise<User> => {
    const role = await prisma.role.findFirst({ where: { id: roleId } });

    if (!role) throw new BadRequestError(`role ${roleId} is not exist`);

    return prisma.user.create({
      data: {
        username,
        fullName,
        room: roomId ? { connect: { id: roomId } } : undefined,
        email,
        password: hashedPass,
        role: { connect: { id: role.id } },
      },
      include: { role: true, room: true },
    });
  };

  static createRootAccount = async (
    username: string,
    fullName: string,
    roleName: string,
    email: string,
    password: string
  ) => {
    await prisma.user.create({
      data: {
        username,
        fullName,
        role: {
          create: {
            name: roleName,
            permissions: { create: { action: "manage", subject: "all" } },
          },
        },
        email,
        password,
      },
    });
  };

  static updateUser = async (
    id: number,
    username: string,
    fullName: string,
    roleId: number,
    email: string,
    roomId?: number
  ): Promise<User> => {
    const user = await prisma.user.update({
      where: { id },
      data: {
        username,
        fullName,
        email,
        room: roomId ? { connect: { id: roomId } } : undefined,
        role: { connect: { id: roleId } },
      },
      include: { role: true, room: true },
    });

    return user;
  };

  static changePassword = async (id: number, newHashedPaswword: string) => {
    const user = await prisma.user.update({
      where: { id },
      data: {
        password: newHashedPaswword,
      },
      include: { role: true, room: true },
    });

    return user;
  };

  static findByEmail = async (email: string): Promise<User | null> => {
    const user = prisma.user.findUnique({
      // Change to findUnique
      where: { email },
      include: { role: true, room: true },
    });

    return user;
  };

  static findById = async (id: number): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: { include: { permissions: true } }, room: true },
    });
    return user;
  };

  static findAll = async (): Promise<User[]> => {
    const users = await prisma.user.findMany({
      include: { role: true, room: true },
    });
    return users;
  };
}
