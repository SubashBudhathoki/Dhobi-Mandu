import { ZodError } from "zod";
import { Request, Response } from "express";
import ErrorService from "../error/service";
import OrderService from "./service";
import UserService from "../user/service";
import HtmlParser from "../htmlParser/service";
import MailService from "../mail/service";
export default {
  create: async function (req: Request, res: Response) {
    try {
      const data = req.body;
      const userId = req.userId;

      const user = await UserService.getById(userId);

      if (!user)
        return res.status(404).json({
          message: "User not found",
          success: false,
          data: {},
        });

      const savedOrder = await OrderService.create(data, userId);

      const emailToVendorParsed = HtmlParser.parseVendorHtml(
        savedOrder,
        user.email
      );

      const vendorEmail = savedOrder.OrderItems[0].Service.vendor.email;

      MailService.sendMail({
        to: vendorEmail,
        subject: "New Order",
        html: emailToVendorParsed,
      });

      return res.status(201).json({
        message: "Order created successfully",
        data: savedOrder,
        success: true,
      });
    } catch (error: any) {
      const handledError = ErrorService.handleError(error);
      return res.status(handledError.status).json(handledError);
    }
  },
  getAllOrders: async function (req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();

      return res.status(200).json({
        message: "Orders fetched successfully",
        data: orders,
        success: true,
      });
    } catch (error: any) {
      const handledError = ErrorService.handleError(error);
      return res.status(handledError.status).json(handledError);
    }
  },
  getSingleOrder: async function (req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        throw new ZodError([
          {
            path: ["id"],
            message: "Invalid id",
            code: "custom",
          },
        ]);
      const order = await OrderService.getSingleOrder(id);
      return res.status(200).json({
        message: "Order fetched successfully",
        data: order,
        success: true,
      });
    } catch (error: any) {
      const handledError = ErrorService.handleError(error);
      return res.status(handledError.status).json(handledError);
    }
  },
  getMyOrders: async function (req: Request, res: Response) {
    try {
      const userId = req.userId;
      const user = await UserService.getById(userId);
      console.log("userId", userId);
      if (!user)
        return res.status(404).json({
          message: "User not found",
          success: false,
          data: {},
        });
      const orders = await OrderService.getOrderByUserId(userId);
      return res.status(200).json({
        message: "Orders fetched successfully",
        data: orders,
        success: true,
      });
    } catch (error: any) {
      const handledError = ErrorService.handleError(error);
      return res.status(handledError.status).json(handledError);
    }
  },
  changeOrderState: async function (req: Request, res: Response) {
    try {
      const data = req.body;
      const id = parseInt(req.params.id);
      if (isNaN(id))
        throw new ZodError([
          {
            path: ["id"],
            message: "Invalid Order Id",
            code: "custom",
          },
        ]);

      const order = await OrderService.changeOrderState(id, data);

      const emailToUserParsed = HtmlParser.parseUserHtml(order, order.state);

      MailService.sendMail({
        to: order.user.email,
        subject: "Order State Changed",
        html: emailToUserParsed,
      });

      return res.status(200).json({
        message: "Order state changed successfully",
        data: order,
        success: true,
      });
    } catch (error: any) {
      const handledError = ErrorService.handleError(error);
      return res.status(handledError.status).json(handledError);
    }
  },
};
