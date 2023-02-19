import { Request, Response } from "express";
import ErrorHandle from "../error/service";
import UserService from "./service";
import TokenService from "../token/service";
import moment from "moment";
export default {
  login: async function (req: Request, res: Response) {
    try {
      const data = req.body;
      const user = await UserService.getByEmailPwd(data.email, data.password);

      const accessToken = TokenService.createToken(
        user.id,
        "7d",
        process.env.JWT_SECRET!
      );

      res.cookie("X-ACCESS-TOKEN-USER", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        expires: moment().add(7, "days").toDate(),
      });

      return res.status(201).json({
        success: true,
        data: {
          user: user,
          token: {
            accessToken,
          },
        },
        message: "User Login Successful",
      });
    } catch (error) {
      res.cookie("X-ACCESS-TOKEN-USER", "", {
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
      const saveUser = await UserService.create(data);
      return res.status(201).json({
        success: true,
        data: saveUser,
        message: "User Register Successful",
      });
    } catch (error) {
      console.log(error);
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  logout: function (req: Request, res: Response) {
    try {
      res.cookie("X-ACCESS-TOKEN-USER", "", {
        httpOnly: true,
        maxAge: 1,
        expires: moment().add(1, "millisecond").toDate(),
      });
      res.cookie("X-ACCESS-TOKEN-VENDOR", "", {
        httpOnly: true,
        maxAge: 1,
        expires: moment().add(1, "millisecond").toDate(),
      });

      return res.status(201).json({
        success: true,
        data: {},
        message: "Logout Successful",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },

  me: async function (req: Request, res: Response) {
    try {
      const userId = req.userId;
      const user = await UserService.getById(userId);
      if (!user || user.id !== userId)
        return res.status(404).json({
          success: false,
          data: {},
          message: "User not found",
        });

      return res.status(201).json({
        success: true,
        data: user,
        message: "My Data",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      const userId = req.userId;
      const data = req.body;
      const user = await UserService.update(userId, data);
      if (!user || user.id !== userId)
        return res.status(404).json({
          success: false,
          data: {},
          message: "User not found",
        });

      return res.status(201).json({
        success: true,
        data: user,
        message: "My Data",
      });
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
};
