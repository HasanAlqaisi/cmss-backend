import { User } from "@prisma/client";
import _ from "lodash";
import prisma from "../../prisma";
import { BadRequestError } from "../../utils/api/api-error";

export default class UserService {
  static reshapeUser = (user: User) => _.omit(user, ["password", "role_id"]);

  static createUser = async (
    name: string,
    roleName: string,
    email: string,
    hashedPass: string
  ): Promise<User> => {
    const role = await prisma.role.findFirst({ where: { name: roleName } });

    if (!role) throw new BadRequestError(`role ${roleName} is not exist`);

    return prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPass,
        role: { connect: { id: role.id } },
      },
    });
  };

  static changePassword = async (id: string, newHashedPaswword: string) => {
    const user = await prisma.user.update({
      where: { id },
      data: {
        password: newHashedPaswword,
      },
    });

    return user;
  };

  static findByEmail = async (email: string): Promise<User | null> => {
    const user = prisma.user.findUnique({
      where: { email },
    });

    return user;
  };

  static findById = async (id: string): Promise<User | null> => {
    const user = prisma.user.findUnique({
      where: { id },
    });
    return user;
  };
}
