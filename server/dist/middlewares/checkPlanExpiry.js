import User from "../models/User.js";
const checkPlanExpiry = async (req, res, next) => {
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
        // Check if plan is expired
        if (user.isPlanExpired()) {
            // Downgrade to Free plan
            user.plan = "Free";
            user.planExpiresAt = undefined;
            user.planRenewable = true;
            await user.save();
            res.status(403).json({
                message: "Your plan has expired. Please renew to continue using premium features.",
                planExpired: true,
                redirectTo: "/UserProfile"
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to check plan status"
        });
    }
};
export default checkPlanExpiry;
