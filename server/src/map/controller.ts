import { LatLan } from "./../@types/index";
import { Request, Response } from "express";
import MapService from "./service";
import ErrorHandle from "../error/service";
import ValidateLatLng from "./validation";

export default {
  aStarDb: async function (req: Request, res: Response) {
    try {
      ValidateLatLng(req.body);
      const {
        start,
        end,
      }: {
        start: LatLan;
        end: LatLan;
      } = req.body;

      const result = await MapService.aStarDb(start, end);
      const returnJson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: result,
          },
        ],
      };
      return res.status(200).json(returnJson);
    } catch (error) {
      const handleError = ErrorHandle.handleError(error);
      return res.status(handleError.status).json(handleError);
    }
  },
};
