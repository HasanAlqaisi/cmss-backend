import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import {
  BadRequestError,
  BadTokenError,
  ForbiddenError,
} from "../../utils/api/api-error";
import { CreatedResponse, OkResponse } from "../../utils/api/api-response";
import UserService from "./service";
import sendEmail from "../../utils/send-email";
import { unAuthorizedMessage } from "../../utils/constants";
import { reshapeData } from "../../utils/reshape-data";
import { UserWithPermissions } from "./types";

const createToken = (id: number): string =>
  jwt.sign({ id }, process.env.TOKEN_SECRET as string, { expiresIn: "1d" });

export const registrationPost = async (req: Request, res: Response) => {
  const data = await validator.register(req);

  const user = await UserService.createUser(
    data.username,
    data.fullname,
    data.roleId,
    data.email,
    data.password,
    data.roomId
  );

  const reshapedUser = reshapeData(user, ["password", "roleId"]) as User;

  return new CreatedResponse(reshapedUser).send(res);
};

export const loginPost = async (req: Request, res: Response) => {
  const data = await validator.login(req);

  const user = await UserService.findByEmail(data.email);

  if (!user) throw new BadTokenError();

  const passwordMatch = await bcrypt.compare(data.password, user.password);

  if (!passwordMatch) throw new BadTokenError();

  const token = createToken(user.id);

  const reshapedUser = reshapeData(user, ["password", "roleId"]) as User;

 

  return new OkResponse({ token, user: reshapedUser }).send(res);
};

export const logoutPost = async (_: Request, res: Response) => {
  res.clearCookie("access-token");
  res.clearCookie("user");
  return new OkResponse("Logged out").send(res);
};

export const changePassPut = async (req: Request, res: Response) => {
  const { new_password: newPassword } = await validator.updatePasswordBody(req);

  const { id } = await generalValidator.id(req);

  const userRequester = req.user as UserWithPermissions;

  // Get the user targeted to change his password
  const userTarget = await UserService.findById(Number(id));

  if (
    userTarget &&
    (userRequester.role.name === "root" || userRequester.id === userTarget.id)
  ) {
    // Change the target user password
    const updatedUser = await UserService.changePassword(
      userTarget.id,
      newPassword
    );

    const reshapedUser = reshapeData(updatedUser, [
      "password",
      "roleId",
    ]) as User;

    return new OkResponse(reshapedUser).send(res);
  }

  throw new ForbiddenError();
};

export const forgetPasswordPost = async (req: Request, res: Response) => {
  const { email } = await validator.email(req);

  const user = await UserService.findByEmail(email);

  if (user) {
    // Create a token to verify the user later
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.FORGET_PASS_KEY as string,
      { expiresIn: "1h" }
    );

    const baseUrl = "localhost:3000/users/reset-password";

    const link = `${baseUrl}/${user.id}/${token}`;

    await sendEmail(
      user.email,
      "Reset Password Request",
      `<p>Please click this link: <a href="${link}">${link}</a></p>`,
      "Reset your password"
    );

    return new OkResponse({
      details:
        "A message with link sent to the email, check it to reset your password",
    }).send(res);
  }

  return new OkResponse(
    "A message with link sent to the email, check it to reset your password"
  ).send(res);
};

export const resetPasswordPost = async (req: Request, res: Response) => {
  const { new_password: newPassword } = await validator.resetPass(req);

  const { token } = req.params;

  let decodedToken: string | JwtPayload | undefined;

  jwt.verify(token, process.env.FORGET_PASS_KEY as string, (err, decoded) => {
    // err
    if (err) throw new BadTokenError(unAuthorizedMessage);
    // decoded token
    decodedToken = decoded;
  });

  const { id } = decodedToken as any;

  const user = await UserService.findById(id);

  if (user) {
    const updatedUser = await UserService.changePassword(id, newPassword);

    const reshapedUser = reshapeData(updatedUser, [
      "password",
      "roleId",
    ]) as User;

    return new OkResponse(reshapedUser).send(res);
  }

  throw new BadRequestError("User not found");
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const user = await UserService.findById(Number(id));

  const reshapedUser = reshapeData(user!, ["password", "roleId"]) as User;

  return new OkResponse(reshapedUser).send(res);
};

export const getUserProfile = async (req: Request, res: Response) => {
  const reshapedUser = reshapeData(req.user!, [
    "role.permissions",
    "password",
  ]) as object;
  return new OkResponse(reshapedUser).send(res);
};

export const getUsers = async (_: Request, res: Response) => {
  const users = await UserService.findAll();

  const reshapedUsers = reshapeData(users, ["password", "roleId"]) as User[];

  return new OkResponse(reshapedUsers).send(res);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  const data = await validator.updateUser(req);

  const user = await UserService.updateUser(
    idNumber,
    data.username,
    data.fullname,
    data.roleId,
    data.email,
    data.roomId
  );

  const reshapedUser = reshapeData(user, ["password"]) as User;

  return new OkResponse(reshapedUser).send(res);
};
