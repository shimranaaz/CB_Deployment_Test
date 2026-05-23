import mongoose, { Schema } from "mongoose";
const CouponSchema = new Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ["percent", "percentage", "flat"],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
