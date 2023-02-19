import { Vendor } from "@prisma/client";
import * as z from "zod";

const VendorSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  address: z.string().min(3, {
    message: "Address must be at least 3 characters long",
  }),
});

const VendorUpdateSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",
  }),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  address: z.string().min(3, {
    message: "Address must be at least 3 characters long",
  }),
});

const VendorLoginSchema = z.object({
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

export function ValidateRegister(data: Vendor) {
  return VendorSchema.parse(data);
}

export function ValidateUpdate(data: Vendor) {
  return VendorUpdateSchema.parse(data);
}

export function ValidateLogin(data: { email: string; password: string }) {
  return VendorLoginSchema.parse(data);
}
