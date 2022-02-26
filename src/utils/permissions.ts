import { AbilityBuilder, AbilityClass } from "@casl/ability";
import { PrismaAbility } from "@casl/prisma";
import { Prisma, User } from "@prisma/client";
import Mustache from "mustache";
import { UserWithPermissions } from "../atoms/users/types";
import logger from "./config/logger";

type AppAbilityType = PrismaAbility<[string, Prisma.ModelName | "all"]>;

const AppAbility = PrismaAbility as AbilityClass<AppAbilityType>;

const { can, build } = new AbilityBuilder(AppAbility);

export default (user?: UserWithPermissions) => {
  user?.role.permissions.forEach((permission) => {
    // Reading conditions object
    const conditionsObject = permission.conditions as Prisma.JsonObject;

    if (conditionsObject) {
      // replacing id placeholder with the actual one
      const stringId = Mustache.render(conditionsObject.id as any, {
        id: user.id,
      });

      conditionsObject.id = Number(stringId);
    }

    can(permission.action, permission.subject, conditionsObject as any);
  });
  return build();
};
