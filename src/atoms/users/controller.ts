import { Request, Response } from "express";
import bycrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
// import { ForbiddenError, subject } from "@casl/ability";
import { BadRequestError, BadTokenError } from "../../utils/api/api-error";
import { CreatedResponse, OkResponse } from "../../utils/api/api-response";
import UserService from "./service";
// import defineAbilityFor from "../../utils/permissions";
import getIdFromPayload from "../../utils/get-id-from-payload";
import sendEmail from "../../utils/send-email";
import { unAuthorizedMessage } from "../../utils/constants";
import { reshapeUser } from "../../utils/reshape-user";

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

  return new CreatedResponse(reshapeUser(user)).send(res);
};

export const loginPost = async (req: Request, res: Response) => {
  const data = await validator.login(req);

  const user = await UserService.findByEmail(data.email);

  if (!user) throw new BadRequestError("Incorrect email and/or password");

  const passwordMatch = await bycrypt.compare(data.password, user.password);

  if (!passwordMatch)
    throw new BadRequestError("Incorrect email and/or password");

  const token = createToken(user.id);

  return new OkResponse({ token, user: reshapeUser(user) }).send(res);
};

export const changePassPut = async (req: Request, res: Response) => {
  const { new_password: newPassword } = await validator.updatePasswordBody(req);

  const { id } = await generalValidator.id(req);

  const { authorization } = req.headers;

  // Extract id of the user who made the request
  const userRequesterId = getIdFromPayload(authorization!);

  // Get the user requester information
  const userRequester = await UserService.findById(userRequesterId);

  // Define ability for the user to check his permissions
  //   const ability = defineAbilityFor(userRequester!);

  // Get the user targeted to change his password
  const userTarget = await UserService.findById(Number(id));

  // check if the user requester can change password of the user target
  //   ForbiddenError.from(ability).throwUnlessCan(
  //     "update",
  //     subject("User", userTarget!)
  //   );

  // Change the user password
  const updatedUser = await UserService.changePassword(Number(id), newPassword);

  return new OkResponse(reshapeUser(updatedUser)).send(res);
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

    return new OkResponse(reshapeUser(updatedUser)).send(res);
  }

  throw new BadRequestError("User not found");
};
