import { LatLan } from "./../@types/index";
import { z } from "zod";

const LatLanSchema = z.object({
  latitude: z
    .number({
      errorMap: (err) => {
        return {
          code: "INVALID_LATITUDE",
          message: "Latitude must be a number",
        };
      },
    })
    .min(-90, {
      message: "Latitude must be between -90 and 90",
    })
    .max(90, {
      message: "Latitude must be between -90 and 90",
    }),
  longitude: z
    .number({
      errorMap: (err) => {
        return {
          code: "INVALID_LONGITUDE",
          message: "Longitude must be a number",
        };
      },
    })
    .min(-180, {
      message: "Latitude must be between -180 and 180",
    })
    .max(180, {
      message: "Latitude must be between -180 and 180",
    }),
});

const bodySchema = z.object({
  start: LatLanSchema,
  end: LatLanSchema,
});

export default function ValidateLatLng(data: { start: LatLan; end: LatLan }) {
  return bodySchema.safeParse(data);
}
