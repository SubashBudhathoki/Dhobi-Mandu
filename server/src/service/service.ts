import { Service } from "@prisma/client";
import { prisma } from "../index";
import Validate from "./validation";
export default {
  getAll: async function () {
    return await prisma.service.findMany();
  },
  getOne: async function (id: number) {
    return await prisma.service.findUnique({
      where: {
        id: id,
      },
    });
  },
  create: async function (data: Service) {
    await Validate(data);
    console.log(data);
    return await prisma.service.create({
      data: data,
    });
  },
  update: async function (id: number, data: Service) {
    await Validate(data);
    return await prisma.service.update({
      where: {
        id: id,
      },
      data: data,
    });
  },
  delete: async function (id: number) {
    return await prisma.service.delete({
      where: {
        id: id,
      },
    });
  },
};
