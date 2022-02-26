import { Request, Response } from "express";
import bycrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import { BadRequestError, BadTokenError } from "../../utils/api/api-error";
import { CreatedResponse, OkResponse } from "../../utils/api/api-response";
import UserService from "./service";
import getIdFromPayload from "../../utils/get-id-from-payload";
import sendEmail from "../../utils/send-email";
import { unAuthorizedMessage } from "../../utils/constants";
import { reshapeData } from "../../utils/reshape-data";

const createToken = (id: number): string =>
  jwt.sign({ id }, process.env.TOKEN_SECRET as string, { expiresIn: "1d" });

export const signupPost = async (req: Request, res: Response) => {
  const data = await validator.register(req);

  const user = await UserService.createUser(
    data.username,
    data.fullname,
    data.role,
    data.email,
    data.password
  );

  const reshapedUser = reshapeData(user, ["password", "roleId"]) as User;

  return new CreatedResponse(reshapedUser).send(res);
};

export const loginPost = async (req: Request, res: Response) => {
  const data = await validator.login(req);

  const user = await UserService.findByEmail(data.email);

  if (!user) throw new BadRequestError("Incorrect email and/or password");

  const passwordMatch = await bycrypt.compare(data.password, user.password);

  if (!passwordMatch)
    throw new BadRequestError("Incorrect email and/or password");

  const token = createToken(user.id);

  const reshapedUser = reshapeData(user, ["password", "roleId"]) as User;

  res.cookie("jwt", token, { path: "/", httpOnly: true });
  return new OkResponse({ user: reshapedUser }).send(res);
};

export const logoutPost = async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  return new OkResponse("Logged out").send(res);
};

export const changePassPut = async (req: Request, res: Response) => {
  const { new_password: newPassword } = await validator.updatePasswordBody(req);

  const { id } = await generalValidator.id(req);

  // Get the user targeted to change his password
  const userTarget = await UserService.findById(Number(id));

  // Change the user password
  const updatedUser = await UserService.changePassword(Number(id), newPassword);

  const reshapedUser = reshapeData(updatedUser, ["password", "roleId"]) as User;

  return new OkResponse(reshapedUser).send(res);
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

    const baseUrl = "localhost:3000/api/users/reset-password";

    await sendEmail(
      user.id,
      user.email,
      token,
      baseUrl,
      "Reset Password Request",
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
  const reshapedUser = reshapeData(req.user!, ["role.permissions"]) as object;
  return new OkResponse(reshapedUser).send(res);
};

export const getUsers = async (req: Request, res: Response) => {
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
    data.email
  );

  const reshapedUser = reshapeData(user, ["password"]) as User;

  return new OkResponse(reshapedUser).send(res);
};
