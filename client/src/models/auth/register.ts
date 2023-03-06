import { z } from "zod";

const RegisterSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters long",
    }),
    email: z.string().email({
      message: "Email must be a valid email address",
    }),
    address: z.string().min(3, {
      message: "Address must be at least 3 characters long",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    phone: z.string().superRefine((data, ctx) => {
      if (isNaN(Number(data))) {
        ctx.addIssue({
          path: ["phone"],
          message: "Phone must be a number",
          code: "custom",
        });
      }
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });
export default RegisterSchema;
