import User from "../models/User";
export const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.userId);
            if (!user || !roles.includes(user.role)) {
                res.status(403).json({ message: "Access denied" });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({ message: "Authorization check failed" });
        }
    };
};
