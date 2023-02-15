import { User, Vendor } from "@prisma/client";
import jwt from "jsonwebtoken";

export default {
  createToken: function (payload: number, expire: string, secret: string) {
    return jwt.sign({ id: payload }, secret, { expiresIn: expire });
  },
  verifyToken: function (token: string, secret: string) {
    return jwt.verify(token, secret);
  },
};
