import { Request } from "express";
import { z } from "zod";
import bycrypt from "bcrypt";

export const login = async (req: Request) => {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  return schema.parseAsync(req.body);
};

export const register = async (req: Request) => {
  const schema = z.object({
    username: z
      .string()
      .regex(
        /^(\w|\d){5,}$/i,
        "sholud be at least 5 characters and from this set (a-z,0-9,_) "
      ),
    email: z.string().email({ message: "Email field must be valid" }),
    password: z
      .string()
      .min(8)
      .transform((value) => bycrypt.hashSync(value, 10)),
    role: z.string(),
  });

  return schema.parseAsync(req.body);
};

export const updatePasswordBody = async (req: Request) => {
  const schema = z.object({
    new_password: z
      .string()
      .min(8)
      .transform((value) => bycrypt.hashSync(value, 10)),
  });

  return schema.parseAsync(req.body);
};

export const resetPass = async (req: Request) => {
  const schema = z
    .object({
      new_password: z.string().min(8),
      confirm_password: z.string(),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm"], // path of error
    })
    .transform((value) => ({
      new_password: bycrypt.hashSync(value.new_password, 10),
      confirm_password: value.confirm_password,
    }));

  return schema.parseAsync(req.body);
};
export const id = async (req: Request) => {
  const schema = z.object({
    id: z.string(),
  });
  return schema.parseAsync(req.params);
};

export const email = async (req: Request) => {
  const schema = z.object({
    email: z.string().email(),
  });
  return schema.parseAsync(req.body);
};

