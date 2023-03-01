import { ZodError } from "zod";
import { Request, Response } from "express";
import ServiceService from "./service";
import ErrorHandle from "../error/service";
export default {
  showAll: async function (req: Request, res: Response) {
    try {
      const services = await ServiceService.getAll();
      return res.status(201).json({
        success: true,
        data: services,
        message: "Show All services",
      });
    } catch (error: any) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  showOne: async function (req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ZodError([
          {
            path: ["id"],
            message: "id must be a number",
            code: "custom",
          },
        ]);
      }
      const Service = await ServiceService.getOne(id);
      if (!Service)
        return res.status(404).json({
          success: false,
          data: {},
          message: "Service Not Found",
        });
      return res.status(201).json({
        success: true,
        data: Service,
        message: "Show One Service",
      });
    } catch (error: any) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  create: async function (req: Request, res: Response) {
    try {
      const vendorId = req.vendorId;
      const data = req.body;
      const savedService = await ServiceService.create({ ...data, vendorId });
      return res.status(201).json({
        success: true,
        data: savedService,
        message: "Service Created",
      });
    } catch (error: any) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ZodError([
          {
            path: ["id"],
            message: "id must be a number",
            code: "custom",
          },
        ]);
      }
      const data = req.body;
      const vendorId = req.vendorId;

      const updatedService = await ServiceService.update(id, {
        ...data,
        vendorId,
      });
      return res.status(201).json({
        success: true,
        data: updatedService,
        message: "Service Updated",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        throw new ZodError([
          {
            path: ["id"],
            message: "id must be a number",
            code: "custom",
          },
        ]);
      await ServiceService.delete(id);
      return res.status(201).json({
        success: true,
        data: {},
        message: "Service Deleted",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
};
