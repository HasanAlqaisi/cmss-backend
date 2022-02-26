import { AbilityBuilder, AbilityClass } from "@casl/ability";
import { PrismaAbility } from "@casl/prisma";
import { Prisma, User } from "@prisma/client";
import { UserWithPermissions } from "../atoms/users/types";
import logger from "./config/logger";

type AppAbilityType = PrismaAbility<[string, Prisma.ModelName | "all"]>;

const AppAbility = PrismaAbility as AbilityClass<AppAbilityType>;

const { can, build } = new AbilityBuilder(AppAbility);

export default (user?: UserWithPermissions) => {
  logger.debug(user?.email);
  user?.role.permissions.forEach((permission) => {
    // const conditionsObject = permission.conditions as Prisma.JsonObject;
    // can(permission.action, permission.subject, conditionsObject);
    logger.debug(`${permission.action}, ${permission.subject}`);
    can(permission.action, permission.subject);
  });
  return build();
};
