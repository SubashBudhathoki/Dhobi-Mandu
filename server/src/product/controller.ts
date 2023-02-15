import { ZodError } from "zod";
import { Request, Response } from "express";
import ProductService from "./service";
import ErrorHandle from "../error/service";
export default {
  showAll: async function (req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();
      return res.status(201).json({
        success: true,
        data: products,
        message: "Show All products",
      });
    } catch (error: any) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  showOne: async function (req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(id);
      if (isNaN(id)) {
        throw new ZodError([
          {
            path: ["id"],
            message: "id must be a number",
            code: "custom",
          },
        ]);
      }
      const product = await ProductService.getOne(id);
      if (!product)
        return res.status(404).json({
          success: false,
          data: {},
          message: "Product Not Found",
        });
      return res.status(201).json({
        success: true,
        data: product,
        message: "Show One product",
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
      const savedProduct = await ProductService.create({ ...data, vendorId });
      return res.status(201).json({
        success: true,
        data: savedProduct,
        message: "Product Created",
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

      const updatedProduct = await ProductService.update(id, {
        ...data,
        vendorId,
      });
      return res.status(201).json({
        success: true,
        data: updatedProduct,
        message: "Product Updated",
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
      await ProductService.delete(id);
      return res.status(201).json({
        success: true,
        data: {},
        message: "Product Deleted",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
};
