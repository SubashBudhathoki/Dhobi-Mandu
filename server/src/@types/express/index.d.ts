export {};

declare global {
  namespace Express {
    interface Request {
      userId: Number;
      vendorId: Number;
    }
  }
}
