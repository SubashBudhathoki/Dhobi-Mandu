import { Product } from "@prisma/client";
import * as z from "zod";
import VS from "../vendor/service";

const ProductSchema = z
  .object({
    name: z
      .string({
        errorMap: (err) => {
          return {
            ...err,
            message: "Name is required",
          };
        },
      })
      .min(3, {
        message: "Name must be at least 3 characters long",
      })
      .max(255, {
        message: "Name must be at most 255 characters long",
      }),
    price: z
      .number({
        errorMap: (err) => {
          return {
            ...err,
            message: "Price is required",
          };
        },
      })
      .min(0, {
        message: "Price must be at least 0",
      })
      .max(1000000, {
        message: "Price must be at most 1000000",
      }),
    description: z
      .string({
        errorMap: (err) => {
          return {
            ...err,
            message: "Description is required",
          };
        },
      })
      .min(3, {
        message: "Description must be at least 3 characters long",
      }),
    image: z
      .string({
        errorMap: (err) => {
          return {
            ...err,
            message: "Image is required",
          };
        },
      })
      .url({
        message: "Image must be a valid URL",
      }),
    vendorId: z.number({
      errorMap: (err) => {
        return {
          ...err,
          message: "VendorId is required",
        };
      },
    }),
  })
  .superRefine(async (data, ctx) => {
    //   see if database has that vendor or not. If not, throw error
    const vendorId = data.vendorId;
    const vendor = await VS.getById(vendorId);
    if (!vendor) {
      ctx.addIssue({
        code: "custom",
        message: "Vendor does not exist",
        path: ["vendorId"],
      });
    }
  });

export default async function Validate(data: Product) {
  return await ProductSchema.parseAsync(data);
}
