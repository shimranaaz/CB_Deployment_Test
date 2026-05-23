import User from "../models/User.js";
const salesOrAdmin = async (req, res, next) => {
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
        if (user.role !== "admin" && user.role !== "sales") {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Authorization failed"
        });
    }
};
export default salesOrAdmin;
