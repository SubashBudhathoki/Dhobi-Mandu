import { z } from "zod";

const RegisterSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters long",
    }),
    email: z.string().email({
      message: "Email must be a valid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
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
