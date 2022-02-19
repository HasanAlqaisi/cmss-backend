import { User } from "@prisma/client";
import _ from "lodash";

// eslint-disable-next-line import/prefer-default-export
export const reshapeUser = (user: User) =>
  _.omit(user, ["password"]);
