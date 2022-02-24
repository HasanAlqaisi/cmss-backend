import { User } from "@prisma/client";
import _ from "lodash";
import prisma from "../../prisma";
import { BadRequestError } from "../../utils/api/api-error";

export default class UserService {
  static createUser = async (
    username: string,
    fullName: string,
    roleName: string,
    email: string,
    hashedPass: string
  ): Promise<User> => {
    const role = await prisma.role.findFirst({ where: { name: roleName } });

    if (!role) throw new BadRequestError(`role ${roleName} is not exist`);

    return prisma.user.create({
      data: {
        username,
        fullName,
        email,
        password: hashedPass,
        role: { connect: { id: role.id } },
      },
      include: { role: true },
    });
  };

  static changePassword = async (id: number, newHashedPaswword: string) => {
    const user = await prisma.user.update({
      where: { id },
      data: {
        password: newHashedPaswword,
      },
      include: { role: true },
    });

    return user;
  };

  static findByEmail = async (email: string): Promise<User | null> => {
    const user = prisma.user.findUnique({
      // Change to findUnique
      where: { email },
      include: { role: true },
    });

    return user;
  };

  static findById = async (id: number): Promise<User | null> => {
    const user =await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    return user;
  };

  static findAll = async (): Promise<User[]> => {
    const users = await prisma.user.findMany({ include: { role: true } });
    return users;
  };
}
