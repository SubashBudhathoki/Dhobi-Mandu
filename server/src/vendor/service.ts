import { Vendor } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { compare, genSalt, hash } from "bcrypt";
import { prisma } from "../index";
import { RemoveKeyFromObj } from "../utils/helpers";
import { ValidateLogin, ValidateRegister, ValidateUpdate } from "./validation";

export default {
  getById: async function (id: number) {
    return await prisma.vendor.findUnique({
      where: {
        id: id,
      },
    });
  },
  getByEmailPwd: async function (email: string, password: string) {
    ValidateLogin({ email, password });

    const vendor = await prisma.vendor.findUnique({
      where: {
        email: email,
      },
    });

    if (!vendor)
      throw new PrismaClientKnownRequestError("Invalid Credentials", {
        clientVersion: "2.19.0",
        code: "P2001",
      });
    const isMatch = await compare(password, vendor.password);
    if (!isMatch)
      throw new PrismaClientKnownRequestError("Invalid Credentials", {
        clientVersion: "2.19.0",
        code: "P2001",
      });
    return RemoveKeyFromObj(vendor, "password");
  },

  getAll: async function () {
    return await prisma.vendor.findMany();
  },
  create: async function (data: Vendor) {
    ValidateRegister(data);
    const vendorInDb = await prisma.vendor.findUnique({
      where: {
        email: data.email,
      },
    });
    if (vendorInDb)
      throw new PrismaClientKnownRequestError("Vendor already exists", {
        clientVersion: "2.19.0",
        code: "P2002",
      });

    const salt = await genSalt();
    const password = await hash(data.password, salt);
    return await prisma.vendor.create({
      data: { ...data, password },
    });
  },
  update: async function (id: number, data: Vendor) {
    ValidateUpdate(data);
    console.log(data);
    return await prisma.vendor.update({
      where: {
        id: id,
      },
      data: data,
    });
  },
  delete: async function (id: number) {
    return await prisma.vendor.delete({
      where: {
        id: id,
      },
    });
  },
};
