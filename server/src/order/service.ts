import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { OrderItem, ORDER_STATE, Service } from "@prisma/client";
import { Order, ValidateOrderState } from "./validation";
import { prisma } from "../index";
import ValidateOrderItems from "./validation";
export default {
  // vendor
  getAllOrders: async function () {
    return await prisma.order.findMany({
      include: {
        user: true,
        OrderItems: {
          include: {
            Service: {
              include: {
                vendor: true,
              },
            },
          },
        },
      },
    });
  },
  getSingleOrder: async function (id: number) {
    return await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        OrderItems: {
          include: {
            Service: true,
          },
        },
      },
    });
  },
  changeOrderState: async function (id: number, state: { state: ORDER_STATE }) {
    ValidateOrderState(state);
    console.log("CHANGE ORDER STATE");
    return await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        state: state.state,
      },
      include: {
        OrderItems: {
          include: {
            Service: true,
          },
        },
      },
    });
  },
  // user
  getOrderByUserId: async function (userId: number) {
    return await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        OrderItems: {
          include: {
            Service: {
              include: {
                vendor: true,
              },
            },
          },
        },
      },
    });
  },
  create: async function (orderItems: OrderItem[], userId: number) {
    // Throws error if order is invalid
    await ValidateOrderItems(orderItems);

    let orderTotal = 0;
    for (let orderIdx in orderItems) {
      const order = orderItems[orderIdx];
      const Service = (await prisma.service.findUnique({
        where: {
          id: order.serviceId,
        },
      })) as Service;
      const total = Service.price * order.quantity;
      orderItems[orderIdx].total = total;
      orderTotal += total;
    }

    const order = {
      userId: userId,
      OrderItems: orderItems,
      state: ORDER_STATE.RECEIVED,
      total: orderTotal,
    };

    return await prisma.order.create({
      data: {
        state: ORDER_STATE.RECEIVED,
        userId: order.userId,

        OrderItems: {
          create: order.OrderItems.map((item) => {
            return {
              serviceId: item.serviceId,
              quantity: item.quantity,
              total: item.total,
            };
          }),
        },
        total: order.total,
      },
      include: {
        OrderItems: {
          include: {
            Service: true,
          },
        },
      },
    });
  },
};
