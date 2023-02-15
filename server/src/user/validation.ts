import { User } from "@prisma/client";
import * as z from "zod";

const UserSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
});

const UserLoginSchema = z.object({
  email: z
    .string({
      errorMap: (err) => {
        return {
          ...err,
          message: "Email is required",
        };
      },
    })
    .email({
      message: "Email must be a valid email address",
    }),
  password: z
    .string({
      errorMap: (err) => {
        return {
          ...err,
          message: "Password is required",
        };
      },
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),
});

export function ValidateRegister(data: User) {
  return UserSchema.parse(data);
}

export function ValidateLogin(data: { email: string; password: string }) {
  return UserLoginSchema.parse(data);
}
