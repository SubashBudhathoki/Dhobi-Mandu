import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import TokenService from "../token/service";
export default {
  isLoggedIn: function (req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies["X-ACCESS-TOKEN-USER"];
    console.log(accessToken);
    console.log("HERE");
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        data: {},
        message: "Unauthorized",
      });
    }
    try {
      const { id } = TokenService.verifyToken(
        accessToken,
        process.env.JWT_SECRET!
      ) as JwtPayload;
      req.userId = id;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        data: {},
        message: "Unauthorized",
      });
    }
    // verify token
  },
};
