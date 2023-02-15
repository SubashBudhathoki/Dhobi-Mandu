import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { OrderItem, ORDER_STATE, Product } from "@prisma/client";
import { Order, ValidateOrderState } from "./validation";
import { prisma } from "../index";
import ValidateOrderItems from "./validation";
export default {
  // vendor
  getAllOrders: async function () {
    return await prisma.order.findMany({
      include: {
        OrderItems: {
          include: {
            product: true,
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
            product: true,
          },
        },
      },
    });
  },
  changeOrderState: async function (id: number, state: { state: ORDER_STATE }) {
    ValidateOrderState(state);
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
            product: true,
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
            product: true,
          },
        },
      },
    });
  },
  create: async function (orderItems: OrderItem[], userId: number) {
    // Throws error if order is invalid
    // await ValidateOrderItems(orderItems);

    // for each order item, get the product and calculate the total
    let orderTotal = 0;
    for (let orderIdx in orderItems) {
      const order = orderItems[orderIdx];
      const product = (await prisma.product.findUnique({
        where: {
          id: order.productId,
        },
      })) as Product;
      const total = product.price * order.quantity;
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
              productId: item.productId,
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
            product: true,
          },
        },
      },
    });
  },
};
