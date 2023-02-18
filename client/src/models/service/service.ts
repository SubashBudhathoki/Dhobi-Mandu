import { z } from "zod";
export default z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character long",
  }),
  price: z.number().min(0, {
    message: "Price must be at least 0",
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 character long",
  }),
  image: z.string().url({
    message: "Image must be a valid url",
  }),
});
