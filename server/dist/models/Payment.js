import mongoose, { Schema } from "mongoose";
const PaymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resumeId: {
        type: Schema.Types.ObjectId,
        ref: "Resume"
    },
    plan: {
        type: String,
        enum: ["Free", "Trial", "Basic", "Advanced", "Professional"],
        required: true
    },
    type: {
        type: String,
        enum: ['single-template', 'pro-plan', 'linkedin-optimization'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    razorpay_order_id: {
        type: String,
        required: true,
        unique: true
    },
    razorpay_payment_id: {
        type: String
    },
    razorpay_signature: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    templateId: {
        type: String
    },
    templateName: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    failureReason: {
        type: String
    },
    metadata: {
        type: Schema.Types.Mixed
    },
    deletedUserInfo: {
        name: { type: String },
        email: { type: String },
        mobile: { type: String }
    }
}, { timestamps: true });
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ razorpay_payment_id: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
