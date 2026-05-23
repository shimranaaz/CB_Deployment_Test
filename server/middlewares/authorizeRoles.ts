import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const authorizeRoles = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.userId);
      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Authorization check failed" });
    }
  };
};