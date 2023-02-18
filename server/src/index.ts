import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") dotenv.config({ path: ".env.prod" });
else dotenv.config({ path: ".env.dev" });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
// routes
import UserRoutes from "./user/routes";
import VendorRoutes from "./vendor/routes";
import ServiceRoutes from "./service/routes";
import OrderRoutes from "./order/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL_DEV as string,
      process.env.CLIENT_URL_PROD as string,
    ],
    credentials: true,
  })
);

app.use("/user", UserRoutes);
app.use("/vendor", VendorRoutes);
app.use("/service", ServiceRoutes);
app.use("/order", OrderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const prisma = new PrismaClient();
