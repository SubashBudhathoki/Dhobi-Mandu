import { Product } from "@prisma/client";
import { prisma } from "../index";
import Validate from "./validation";
export default {
  getAll: async function () {
    return await prisma.product.findMany();
  },
  getOne: async function (id: number) {
    return await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  },
  create: async function (data: Product) {
    await Validate(data);
    //   after validation
    console.log(data);
    return await prisma.product.create({
      data: data,
    });
  },
  update: async function (id: number, data: Product) {
    await Validate(data);
    return await prisma.product.update({
      where: {
        id: id,
      },
      data: data,
    });
  },
  delete: async function (id: number) {
    return await prisma.product.delete({
      where: {
        id: id,
      },
    });
  },
};
