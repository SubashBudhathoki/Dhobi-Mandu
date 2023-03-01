import { Vendor } from "@prisma/client";
import * as z from "zod";

const VendorSchema = z.object({
  email: z
    .string({
      errorMap: (err) => {
        return {
          ...err,
          message: "Email must be a valid email address",
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
          message: "Password must be at least 6 characters long",
        };
      },
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),
  name: z
    .string({
      errorMap: (err) => {
        return {
          ...err,
          message: "Name must be at least 3 characters long",
        };
      },
    })
    .min(3, {
      message: "Name must be at least 3 characters long",
    }),
  address: z
    .string({
      errorMap: (err) => {
        return {
          ...err,
          message: "Address must be at least 3 characters long",
        };
      },
    })
    .min(3, {
      message: "Address must be at least 3 characters long",
    }),
  address_latitude: z
    .number({
      errorMap: (err) => {
        return {
          ...err,
          message: "Address latitude must be between -90 and 90",
        };
      },
    })
    .min(-90, {
      message: "Address latitude must be between -90 and 90",
    })
    .max(90, {
      message: "Address latitude must be between -90 and 90",
    }),
  address_longitude: z
    .number({
      errorMap: (err) => {
        return {
          ...err,
          message: "Address longitude must be between -180 and 180",
        };
      },
    })
    .min(-180, {
      message: "Address longitude must be between -180 and 180",
    })
    .max(180, {
      message: "Address longitude must be between -180 and 180",
    }),
});

const VendorUpdateSchema = z.object({
  email: z
    .string({
      errorMap: (err) => {
        return {
          ...err,
          message: "Email must be a valid email address",
        };
      },
    })
    .email({
      message: "Email must be a valid email address",
    }),
  name: z
    .string({
      errorMap: (err) => {
        return {
          ...err,
          message: "Email must be a valid email address",
        };
      },
    })
    .min(3, {
      message: "Name must be at least 3 characters long",
    }),
  address: z
    .string({
      errorMap: (err) => {
        return {
          ...err,
          message: "Email must be a valid email address",
        };
      },
    })
    .min(3, {
      message: "Address must be at least 3 characters long",
    }),
  address_latitude: z
    .number({
      errorMap: (err) => {
        return {
          ...err,
          message: "Address latitude must be between -90 and 90",
        };
      },
    })
    .min(-90, {
      message: "Address latitude must be between -90 and 90",
    })
    .max(90, {
      message: "Address latitude must be between -90 and 90",
    }),
  address_longitude: z
    .number({
      errorMap: (err) => {
        return {
          ...err,
          message: "Address longitude must be between -180 and 180",
        };
      },
    })
    .min(-180, {
      message: "Address longitude must be between -180 and 180",
    })
    .max(180, {
      message: "Address longitude must be between -180 and 180",
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
