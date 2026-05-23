import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  resumeId?: mongoose.Schema.Types.ObjectId;
  plan: "Free" | "Trial" | "Basic" | "Advanced" | "Professional";
  type: "single-template" | "pro-plan" | "linkedin-optimization";
  amount: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: "pending" | "success" | "failed";
  templateId?: string;
  templateName?: string;
  paymentMethod?: string;
  failureReason?: string;
  metadata?: any;
  deletedUserInfo?: {
    name: string;
    email: string;
    mobile: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
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
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ razorpay_payment_id: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;