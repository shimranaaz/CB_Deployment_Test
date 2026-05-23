import express from "express";
import Coupon from "../models/Coupon.js";
const couponRouter = express.Router();
// GET /api/coupons — admin dashboard list
couponRouter.get("/", async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ coupons });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch coupons" });
    }
});
// POST /api/coupons — admin create coupon
couponRouter.post("/", async (req, res) => {
    try {
        const { couponCode, discountType, discountValue, maxUses, expiresAt, isActive } = req.body;
        if (!couponCode || !discountType || discountValue === undefined) {
            res.status(400).json({ message: "couponCode, discountType, and discountValue are required" });
            return;
        }
        const existing = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
        if (existing) {
            res.status(400).json({ message: "Coupon code already exists" });
            return;
        }
        const coupon = await Coupon.create({
            couponCode: couponCode.toUpperCase(),
            discountType,
            discountValue,
            maxUses: maxUses || 0,
            expiresAt: expiresAt || null,
            isActive: isActive ?? true,
            usedCount: 0,
        });
        res.status(201).json({ message: "Coupon created successfully", coupon });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to create coupon" });
    }
});
// PATCH /api/coupons/:couponCode/toggle — activate/deactivate
couponRouter.patch("/:couponCode/toggle", async (req, res) => {
    try {
        const { couponCode } = req.params;
        const { isActive } = req.body;
        const coupon = await Coupon.findOneAndUpdate({ couponCode: couponCode.toUpperCase() }, { isActive }, { new: true });
        if (!coupon) {
            res.status(404).json({ message: "Coupon not found" });
            return;
        }
        res.status(200).json({ message: `Coupon ${isActive ? "activated" : "deactivated"}`, coupon });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to toggle coupon" });
    }
});
// DELETE /api/coupons/:id — admin delete coupon
couponRouter.delete("/:id", async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            res.status(404).json({ message: "Coupon not found" });
            return;
        }
        res.status(200).json({ message: "Coupon deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to delete coupon" });
    }
});
// POST /api/coupons/validate — called from Payment.tsx
couponRouter.post("/validate", async (req, res) => {
    try {
        const { couponCode, originalPrice } = req.body;
        if (!couponCode || !originalPrice) {
            res.status(400).json({ message: "couponCode and originalPrice are required" });
            return;
        }
        const coupon = await Coupon.findOne({
            couponCode: couponCode.toUpperCase(),
            isActive: true,
        });
        if (!coupon) {
            res.status(404).json({ valid: false, message: "Invalid or expired coupon" });
            return;
        }
        // Check expiry
        if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
            res.status(400).json({ valid: false, message: "This coupon has expired" });
            return;
        }
        let discountAmount = 0;
        if (coupon.discountType === "percentage" || coupon.discountType === "percent") {
            discountAmount = Math.round((originalPrice * coupon.discountValue) / 100);
        }
        else {
            discountAmount = Math.min(coupon.discountValue, originalPrice);
        }
        const finalPrice = Math.max(originalPrice - discountAmount, 0);
        //  Increment usedCount when coupon is successfully validated
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
        res.status(200).json({
            valid: true,
            message: "Coupon applied successfully",
            couponCode: coupon.couponCode,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount,
            originalPrice,
            finalPrice,
        });
    }
    catch (error) {
        console.error("Validate Coupon Error:", error);
        res.status(500).json({ message: error.message || "Failed to validate coupon" });
    }
});
export default couponRouter;
