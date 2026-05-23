import { Request, Response } from "express";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import express from "express";

import Razorpay from "razorpay";

const router = express.Router();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ CRITICAL: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set!");
  throw new Error("Missing Razorpay credentials");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("✅ Razorpay initialized");

const normalizePlan = (planNameOrKey: string): "Free" | "Trial" | "Basic" | "Advanced" | "Professional" => {
  const planMap: Record<string, "Free" | "Trial" | "Basic" | "Advanced" | "Professional"> = {
    "free": "Free",
    "trial": "Trial",
    "starter": "Basic",
    "power": "Advanced",
    "pro": "Professional",

    "Free Forever": "Free",
    "Trial · 7 Days": "Trial",
    "Starter · 1 Month": "Basic",
    "Power User · 3 Months": "Advanced",
    "Pro Member · 1 Year": "Professional",

    "Free": "Free",
    "Trial": "Trial",
    "Basic": "Basic",
    "Advanced": "Advanced",
    "Professional": "Professional",
  };
  const normalized = planMap[planNameOrKey];
  if (!normalized) {
    console.warn(`⚠️ Unknown plan "${planNameOrKey}" — defaulting to "Basic"`);
    return "Basic";
  }
  return normalized;
};


const calculatePlanExpiration = (plan: string): Date => {
  const expirationDate = new Date();

  if (plan === "Trial") {
    expirationDate.setDate(expirationDate.getDate() + 7);
  } else if (plan === "Basic") {
    expirationDate.setMonth(expirationDate.getMonth() + 1);
  } else if (plan === "Advanced") {
    expirationDate.setMonth(expirationDate.getMonth() + 3);
  } else if (plan === "Professional") {
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  } else {
    expirationDate.setMonth(expirationDate.getMonth() + 1);
  }

  return expirationDate;
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, type, plan, templateId, templateName, resumeId } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!amount || !type || !plan) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const normalizedPlan = normalizePlan(plan);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        type,
        plan: normalizedPlan,
        templateId: templateId || "",
        templateName: templateName || "",
        resumeId: resumeId || "",
      },
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      userId,
      resumeId: resumeId || undefined,
      plan: normalizedPlan,
      type,
      amount,
      currency: "INR",
      razorpay_order_id: order.id,
      status: "pending",
      templateId: templateId || undefined,
      templateName: templateName || undefined,
      metadata: { notes: options.notes },
    });

    await payment.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("❌ Create Order Error:", error);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ message: "Missing payment details" });
      return;
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        { status: "failed", failureReason: "Invalid signature" }
      );
      res.status(400).json({ success: false, message: "Payment verification failed" });
      return;
    }

    const payment = await Payment.findOne({ razorpay_order_id });
    if (!payment) {
      res.status(404).json({ message: "Payment record not found" });
      return;
    }

    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.status = "success";
    await payment.save();

    const user = await User.findById(payment.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (payment.type === "pro-plan") {
      const Resume = (await import("../models/Resume.js")).default;

      const downloadedResumesCount = await Resume.countDocuments({
        userId: user._id,
        hasBeenDownloaded: true,
      });

      user.plan = payment.plan;
      user.planExpiresAt = calculatePlanExpiration(payment.plan);
      user.planRenewable = true;
      user.downloadCount = downloadedResumesCount;
      user.personalInfoLocked = false;
      user.personalInfoEditCount = 0;


      user.linkedinOptimizationCount = 0;

      const resumeToReset = await Resume.findOne({
        userId: user._id,
        hasBeenDownloaded: true,
      }).sort({ firstDownloadDate: 1 });

      if (resumeToReset) {
        resumeToReset.hasBeenDownloaded = false;
        resumeToReset.firstDownloadDate = undefined;
        await resumeToReset.save();
      }

      console.log(`✨ Plan upgraded to ${payment.plan}:`);
      console.log(`   - Download count reset to ${downloadedResumesCount}/${user.downloadLimit}`);
      console.log(`   - Personal info edit count reset to 0`);
      console.log(`   - Personal info unlocked`);
      console.log(`   - LinkedIn optimization count reset to 0`);
      console.log(`   - ${resumeToReset ? "1" : "0"} resumes reset (hasBeenDownloaded = false)`);
    } else if (payment.type === "single-template" && payment.templateId) {
      if (!user.unlockedTemplates.includes(payment.templateId)) {
        user.unlockedTemplates.push(payment.templateId);
      }
      if (payment.plan !== "Free") {
        user.plan = payment.plan;
      }
    } else if (payment.type === "linkedin-optimization") {
      user.linkedinPaid = true;
      user.linkedinOptimizationCount = 0;
      console.log(`✅ LinkedIn optimization unlocked for user ${user._id}`);
    }

    await user.save();


    try {
      const { sendPaymentSuccessEmail } = await import("../controllers/userController.js");
      await sendPaymentSuccessEmail(user.email, user.name, {
        amount: payment.amount,
        plan: payment.plan,
        transactionId: razorpay_payment_id,
        paymentDate: new Date(),
        type: payment.type,
        templateName: payment.templateName,
      });
    } catch (emailError) {
      console.error("Failed to send payment success email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      unlockedTemplates: user.unlockedTemplates,
      personalInfoLocked: user.personalInfoLocked,
      personalInfoEditCount: user.personalInfoEditCount,
    });
  } catch (error: any) {
    console.error("❌ Verify Payment Error:", error);
    res.status(500).json({ message: error.message || "Payment verification failed" });
  }
};

// ===================== WEBHOOK HANDLER =====================
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    if (!signature) {
      res.status(400).json({ message: "Missing signature" });
      return;
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET as string)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      res.status(400).json({ message: "Invalid signature" });
      return;
    }

    const event = req.body.event;
    const payloadData = req.body.payload.payment.entity;

    if (event === "payment.captured") {
      const payment = await Payment.findOne({ razorpay_order_id: payloadData.order_id });

      if (payment && payment.status !== "success") {
        payment.razorpay_payment_id = payloadData.id;
        payment.status = "success";
        payment.paymentMethod = payloadData.method;
        await payment.save();

        const user = await User.findById(payment.userId);
        if (user) {
          if (payment.type === "pro-plan") {
            const Resume = (await import("../models/Resume.js")).default;

            const downloadedResumesCount = await Resume.countDocuments({
              userId: user._id,
              hasBeenDownloaded: true,
            });

            user.plan = payment.plan;
            user.planExpiresAt = calculatePlanExpiration(payment.plan);
            user.planRenewable = true;
            user.downloadCount = downloadedResumesCount;
            user.personalInfoLocked = false;
            user.personalInfoEditCount = 0;

            const resumeToReset = await Resume.findOne({
              userId: user._id,
              hasBeenDownloaded: true,
            }).sort({ firstDownloadDate: 1 });

            if (resumeToReset) {
              resumeToReset.hasBeenDownloaded = false;
              resumeToReset.firstDownloadDate = undefined;
              await resumeToReset.save();
            }
          } else if (payment.type === "single-template" && payment.templateId) {
            if (!user.unlockedTemplates.includes(payment.templateId)) {
              user.unlockedTemplates.push(payment.templateId);
            }
            if (payment.plan !== "Free") {
              user.plan = payment.plan;
            }
          }
          await user.save();
        }
      }
    } else if (event === "payment.failed") {
      const payment = await Payment.findOne({ razorpay_order_id: payloadData.order_id });
      if (payment) {
        payment.status = "failed";
        payment.failureReason = payloadData.error_description || "Payment failed";
        await payment.save();
      }
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (error: any) {
    console.error("❌ Webhook Error:", error);
    res.status(500).json({ message: error.message || "Webhook processing failed" });
  }
};

// ===================== GET USER PAYMENTS =====================
export const getUserPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .select("-razorpay_signature");

    res.status(200).json({ success: true, payments });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch payments" });
  }
};

// ===================== CHECK TEMPLATE ACCESS =====================
export const checkTemplateAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { templateId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const freeTemplates = ["digital-pro", "modern-two-column"];

    if (freeTemplates.includes(templateId)) {
      res.status(200).json({ hasAccess: true, reason: "free-template" });
      return;
    }

    if (user.plan !== "Free") {
      const isExpired = user.planExpiresAt && new Date() > user.planExpiresAt;
      if (!isExpired) {
        res.status(200).json({ hasAccess: true, reason: "pro-plan" });
        return;
      }
    }

    if (user.unlockedTemplates.includes(templateId)) {
      res.status(200).json({ hasAccess: true, reason: "purchased-template" });
      return;
    }

    res.status(200).json({ hasAccess: false });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to check access" });
  }
};

// ===================== CHECK DOWNLOAD LIMIT =====================
export const checkDownloadLimit = async (req: Request, res: Response): Promise<void> => {
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

    if (user.isPlanExpired()) {
      res.status(200).json({
        canDownload: false,
        reason: "plan-expired",
        plan: user.plan,
        downloadCount: user.downloadCount,
        downloadLimit: user.downloadLimit,
      });
      return;
    }

    if (user.plan === "Free") {
      res.status(200).json({
        canDownload: false,
        reason: "free-plan",
        plan: user.plan,
        message: "Upgrade to download premium templates",
      });
      return;
    }

    if (!user.hasDownloadsRemaining()) {
      res.status(200).json({
        canDownload: false,
        reason: "limit-exceeded",
        plan: user.plan,
        downloadCount: user.downloadCount,
        downloadLimit: user.downloadLimit,
      });
      return;
    }

    res.status(200).json({
      canDownload: true,
      plan: user.plan,
      downloadCount: user.downloadCount,
      downloadLimit: user.downloadLimit,
      remaining: user.downloadLimit - user.downloadCount,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to check download limit" });
  }
};

// ===================== TRACK DOWNLOAD =====================
export const trackDownload = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { resumeId, template } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const freeTemplates = ["digital-pro", "modern-two-column"];

    if (freeTemplates.includes(template)) {
      console.log(`📥 Free template download (no tracking): ${template}`);
      res.status(200).json({
        success: true,
        isFreeTemplate: true,
        message: "Free template - no tracking",
        resumesRemaining: user.downloadLimit - user.downloadCount,
      });
      return;
    }

    const Resume = (await import("../models/Resume.js")).default;
    const currentResume = await Resume.findById(resumeId);

    if (!currentResume) {
      res.status(404).json({ message: "Resume not found" });
      return;
    }

    if (currentResume.hasBeenDownloaded) {
      console.log(`📥 Re-download (no credit used): Resume ${resumeId}`);
      res.status(200).json({
        success: true,
        isRedownload: true,
        message: "Re-download - no credit used",
        resumesRemaining: user.downloadLimit - user.downloadCount,
        personalInfoLocked: user.personalInfoLocked,
        personalInfoEditCount: user.personalInfoEditCount,
      });
      return;
    }

    const downloadedResumesCount = await Resume.countDocuments({
      userId,
      hasBeenDownloaded: true,
    });

    console.log(`📊 Downloaded resumes: ${downloadedResumesCount}/${user.downloadLimit}`);

    if (downloadedResumesCount >= user.downloadLimit) {
      const firstDownloadedResume = await Resume.findOne({
        userId,
        hasBeenDownloaded: true,
      }).sort({ firstDownloadDate: 1 });

      console.log(`🚫 Download blocked - limit reached`);

      res.status(403).json({
        success: false,
        canDownload: false,
        reason: "limit-exceeded",
        message: `You've used all ${user.downloadLimit} resume slots for your ${user.plan} plan.`,
        resumesUsed: downloadedResumesCount,
        resumesLimit: user.downloadLimit,
        previouslyDownloadedResumeId: firstDownloadedResume?._id.toString(),
        hasEditCreditsRemaining: user.personalInfoEditCount < 1,
      });
      return;
    }

    user.downloadCount = downloadedResumesCount + 1;
    currentResume.hasBeenDownloaded = true;
    currentResume.firstDownloadDate = new Date();

    if (user.personalInfoEditCount >= 1) {
      user.personalInfoLocked = true;
      console.log(`🔒 Personal info LOCKED after download (editCount: ${user.personalInfoEditCount})`);
    }

    await currentResume.save();
    await user.save();

    console.log(`📥 Download tracked: ${downloadedResumesCount + 1}/${user.downloadLimit} resumes used`);

    res.status(200).json({
      success: true,
      isFreeTemplate: false,
      isRedownload: false,
      resumesRemaining: user.downloadLimit - (downloadedResumesCount + 1),
      personalInfoLocked: user.personalInfoLocked,
      personalInfoEditCount: user.personalInfoEditCount,
    });
  } catch (error: any) {
    console.error("❌ Track Download Error:", error);
    res.status(500).json({ message: error.message || "Failed to track download" });
  }
};

// ===================== CHECK RESUME LIMIT =====================
export const checkResumeLimit = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { templateId } = req.query;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const freeTemplates = ["digital-pro", "modern-two-column"];

    if (templateId && freeTemplates.includes(templateId as string)) {
      console.log(`✅ Free template resume creation allowed: ${templateId}`);
      res.status(200).json({
        canCreateResume: true,
        reason: "free-template",
        message: "Free templates have no limits",
      });
      return;
    }

    if (user.plan === "Free") {
      res.status(200).json({
        canCreateResume: true,
        reason: "free-plan",
        message: "Free users can create unlimited resumes",
      });
      return;
    }

    const Resume = (await import("../models/Resume.js")).default;
    const downloadedResumesCount = await Resume.countDocuments({
      userId,
      hasBeenDownloaded: true,
    });

    console.log(`📊 Resume limit check: ${downloadedResumesCount}/${user.downloadLimit}`);

    if (downloadedResumesCount >= user.downloadLimit) {
      const firstDownloadedResume = await Resume.findOne({
        userId,
        hasBeenDownloaded: true,
      }).sort({ firstDownloadDate: 1 });

      console.log(`🚫 Cannot open new resume - limit reached`);

      res.status(403).json({
        canCreateResume: false,
        reason: "limit-exceeded",
        message: `You've used all ${user.downloadLimit} resume slots for your ${user.plan} plan.`,
        resumesUsed: downloadedResumesCount,
        resumesLimit: user.downloadLimit,
        previouslyDownloadedResumeId: firstDownloadedResume?._id.toString(),
        hasEditCreditsRemaining: user.personalInfoEditCount < 1,
        userPlan: user.plan,
      });
      return;
    }

    res.status(200).json({
      canCreateResume: true,
      resumesRemaining: user.downloadLimit - downloadedResumesCount,
      resumesUsed: downloadedResumesCount,
      resumesLimit: user.downloadLimit,
    });
  } catch (error: any) {
    console.error("❌ Check Resume Limit Error:", error);
    res.status(500).json({ message: error.message || "Failed to check resume limit" });
  }
};

// ===================== LOG PAYMENT FAILURE =====================
export const logPaymentFailure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, errorCode, errorDescription, errorReason } = req.body;

    if (!orderId) {
      res.status(400).json({ message: "Order ID is required" });
      return;
    }

    console.log(`📝 Logging payment failure for order: ${orderId}`);
    console.log(`❌ Error: ${errorCode} - ${errorDescription}`);

    const payment = await Payment.findOne({ razorpay_order_id: orderId });

    if (payment) {
      payment.status = "failed";
      payment.failureReason = errorDescription || errorReason || "Payment failed";
      payment.metadata = {
        ...payment.metadata,
        errorCode,
        errorDescription,
        errorReason,
        failedAt: new Date(),
      };
      await payment.save();
      console.log(`✅ Payment failure logged for order: ${orderId}`);
    } else {
      console.log(`⚠️ Payment record not found for order: ${orderId}`);
    }

    res.status(200).json({ success: true, message: "Failure logged successfully" });
  } catch (error: any) {
    console.error("❌ Log Failure Error:", error);
    res.status(500).json({ message: error.message || "Failed to log failure" });
  }
};

// ===================== ADMIN ROUTES =====================
router.delete("/admin/users/:userId", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

router.get("/admin/payments", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({ path: "userId", select: "name email isDeleted" })
      .sort({ createdAt: -1 });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

export default router;