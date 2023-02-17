import * as z from "zod";
import { ORDER_STATE, OrderItem } from "@prisma/client";
export type Order = z.infer<typeof OrderSchema>;
import ServiceService from "../service/service";

const OrderStateSchema = z.object({
  state: z.enum(
    [
      ORDER_STATE.RECEIVED,
      ORDER_STATE.WASHING,
      ORDER_STATE.SHIPPING,
      ORDER_STATE.COMPLETED,
      ORDER_STATE.CANCELLED,
    ],
    {
      errorMap: (err) => {
        return { message: "Invalid Order State" };
      },
    }
  ),
});

const OrderItemSchema = z.array(
  z.object({
    serviceId: z
      .number({
        errorMap: (err) => {
          return { message: "Service Id is Required" };
        },
      })
      .superRefine(async function (v, ctx) {
        const Service = await ServiceService.getOne(v);
        if (!Service) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Service not found",
          });
        }
      }),
    quantity: z.number({
      errorMap: (err) => {
        return { message: "Quantity is Required" };
      },
    }),
  })
);

const OrderSchema = z.object({
  userId: z.number(),
  OrderItems: OrderItemSchema,
  total: z.number(),
  state: OrderStateSchema,
});

export default async function ValidateOrderItems(
  data: { serviceId: number; quantity: number }[]
) {
  return await OrderItemSchema.parseAsync(data);
}

export function ValidateOrderState(data: { state: ORDER_STATE }) {
  return OrderStateSchema.parse(data);
}
