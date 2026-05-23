import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({ 
        message: "Access denied. Admin only." 
      });
      return;
    }

    next();
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || "Authorization failed" 
    });
  }
};

export default adminOnly;