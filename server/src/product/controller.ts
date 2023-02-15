import { Request, Response } from "express";
import ErrorHandle from "../error/service";
export default {
  showAll: function (req: Request, res: Response) {
    try {
      return res.status(201).json({
        success: true,
        data: {},
        message: "Show All products",
      });
    } catch (error: any) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  showOne: function (req: Request, res: Response) {
    try {
      return res.status(201).json({
        success: true,
        data: {},
        message: "Show One product",
      });
    } catch (error: any) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  create: function (req: Request, res: Response) {
    try {
      return res.status(201).json({
        success: true,
        data: {},
        message: "Create",
      });
    } catch (error: any) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  update: function (req: Request, res: Response) {
    try {
      return res.status(201).json({
        success: true,
        data: {},
        message: "Update",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  delete: function (req: Request, res: Response) {
    try {
      return res.status(201).json({
        success: true,
        data: {},
        message: "Delete",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
};
