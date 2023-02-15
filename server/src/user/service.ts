import { compare, hash, genSalt } from "bcrypt";
import { prisma } from "../index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { User } from "@prisma/client";
import { ValidateLogin, ValidateRegister } from "./validation";
import { RemoveKeyFromObj } from "../utils/helpers";
export default {
  getById: async function (id: number) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  },
  getByEmailPwd: async function (email: string, password: string) {
    // throws zod error if validation fails
    ValidateLogin({
      email: email,
      password: password,
    });

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user)
      throw new PrismaClientKnownRequestError("Invalid Credentials", {
        clientVersion: "2.19.0",
        code: "P2001",
      });
    const isMatch = await compare(password, user.password);
    if (!isMatch)
      throw new PrismaClientKnownRequestError("Invalid Credentials", {
        clientVersion: "2.19.0",
        code: "P2001",
      });
    return RemoveKeyFromObj(user, "password");
  },
  getAll: async function () {
    return await prisma.user.findMany();
  },
  create: async function (data: User) {
    // throws zod error if validation fails
    ValidateRegister(data);

    const userInDb = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (userInDb)
      throw new PrismaClientKnownRequestError("User already exists", {
        clientVersion: "2.19.0",
        code: "P2002",
      });

    const salt = await genSalt();
    const password = await hash(data.password, salt);
    return await prisma.user.create({
      data: { ...data, password: password },
    });
  },
  update: async function (id: number, data: User) {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
  },
  delete: async function (id: number) {
    return await prisma.user.delete({
      where: {
        id: id,
      },
    });
  },
};
