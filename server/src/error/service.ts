import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { ZodError } from "zod";

type PrismaError =
  | PrismaClientInitializationError
  | PrismaClientKnownRequestError
  | PrismaClientRustPanicError
  | PrismaClientValidationError
  | PrismaClientUnknownRequestError;

function isPrismaError(error: any) {
  return (
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientValidationError ||
    error instanceof PrismaClientUnknownRequestError
  );
}

export default {
  handleError: function (error: any) {
    console.log(error);
    if (isPrismaError(error)) return this.handlePrismaError(error);
    else if (error instanceof ZodError) return this.handleZodError(error);

    return {
      success: false,
      data: error,
      message: "Error",
      status: 500,
    };
  },

  handlePrismaError: function (error: PrismaError) {
    let message = "";
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          message = "Entity Already Exists";
          break;
        case "P2003":
          message = "Entity Does Not Exist";
          break;
        case "P2001":
          message = "Invalid Credentials";
          break;
        default:
          message = error.message;
          break;
      }
    }

    return {
      success: false,
      data: error,
      message: message,
      status: 409,
    };
  },

  handleZodError: function (error: ZodError) {
    return {
      success: false,
      data: error.flatten().fieldErrors,
      status: 422,
      message: "Validation Error",
    };
  },
};
