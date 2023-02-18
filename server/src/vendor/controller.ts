import { Request, Response } from "express";
import moment from "moment";
import ErrorHandle from "../error/service";
import TokenService from "../token/service";
import VendorService from "./service";
export default {
  login: async function (req: Request, res: Response) {
    try {
      const data = req.body;
      const vendor = await VendorService.getByEmailPwd(
        data.email,
        data.password
      );

      const accessToken = TokenService.createToken(
        vendor.id,
        "7d",
        process.env.JWT_SECRET!
      );
      res.cookie("X-ACCESS-TOKEN-VENDOR", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        expires: moment().add(7, "days").toDate(),
      });
      return res.status(201).json({
        success: true,
        data: {
          vendor: vendor,
          token: {
            accessToken,
          },
        },
        message: "Login",
      });
    } catch (error: any) {
      res.cookie("X-ACCESS-TOKEN-VENDOR", "", {
        httpOnly: true,
        maxAge: 1,
        expires: moment().add(1, "millisecond").toDate(),
      });

      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  register: async function (req: Request, res: Response) {
    try {
      const data = req.body;
      const saveVendor = await VendorService.create(data);
      return res.status(201).json({
        success: true,
        data: saveVendor,
        message: "Register",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },

  me: async function (req: Request, res: Response) {
    try {
      const vendorId = req.vendorId;
      const vendor = await VendorService.getById(vendorId);
      if (!vendor || vendor.id !== vendorId)
        return res.status(404).json({
          success: false,
          data: {},
          message: "Vendor not found",
        });

      return res.status(201).json({
        success: true,
        data: vendor,
        message: "My Data",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  changeOrderState: function (req: Request, res: Response) {
    try {
      return res.status(201).json({
        success: true,
        data: {},
        message: "Change Order State",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
};
