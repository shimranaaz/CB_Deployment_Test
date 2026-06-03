import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: "user" | "admin" | "sales";
  plan: "Free" | "Trial" | "Basic" | "Advanced" | "Professional";
  planExpiresAt?: Date;
  planRenewable: boolean;
  unlockedTemplates: string[];

  downloadCount: number;
  downloadLimit: number;
  lastDownloadReset?: Date;

  personalInfoEditCount: number;
  personalInfoLocked: boolean;
  firstDownloadedResumeId?: mongoose.Types.ObjectId;

  linkedinOptimizationCount: number;
linkedinPaid: boolean;

jdEnhancementCount: number;
jdEnhancementLimit: number;

resumeUploadCount: number;
resumeUploadLimit: number;

  // ✅ NEW: Score fields
  atsScore?: number | null;
  linkedinScore?: number | null;

  otp?: string;
  otpExpire?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): boolean;
  isPlanExpired(): boolean;
  hasDownloadsRemaining(): boolean;
  incrementDownloadCount(): Promise<void>;
  resetDownloadCount(): Promise<void>;
  canUseLinkedInOptimization(): boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, trim: true, minlength: 10, maxlength: 10 },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "sales"], default: "user" },
    plan: {
      type: String,
      enum: ["Free", "Trial", "Basic", "Advanced", "Professional"],
      default: "Free",
    },
    planExpiresAt: { type: Date },
    planRenewable: { type: Boolean, default: true },
    unlockedTemplates: [{ type: String }],

    downloadCount: { type: Number, default: 0 },
    downloadLimit: { type: Number, default: 0 },
    lastDownloadReset: { type: Date },

    otp: { type: String },
    otpExpire: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    personalInfoEditCount: { type: Number, default: 0 },
    personalInfoLocked: { type: Boolean, default: false },
    firstDownloadedResumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
linkedinOptimizationCount: { type: Number, default: 0 },
linkedinPaid: { type: Boolean, default: false },

jdEnhancementCount: { type: Number, default: 0 },
jdEnhancementLimit: { type: Number, default: 1 },

resumeUploadCount: { type: Number, default: 0 },
resumeUploadLimit: { type: Number, default: 9999 },

    // ✅ NEW: Score fields
    atsScore: { type: Number, default: null },
    linkedinScore: { type: Number, default: null },
  },
  { timestamps: true }
);

// ── Methods ──────────────────────────────────────────────────────────────────

UserSchema.methods.hasDownloadsRemaining = function (): boolean {
  if (this.plan === "Free") return true;
  return this.downloadCount < this.downloadLimit;
};

UserSchema.methods.incrementDownloadCount = async function (): Promise<void> {
  this.downloadCount += 1;
  await this.save();
};

UserSchema.methods.resetDownloadCount = async function (): Promise<void> {
  this.downloadCount = 0;
  this.lastDownloadReset = new Date();
  await this.save();
};

UserSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.isPlanExpired = function (): boolean {
  if (!this.planExpiresAt || this.plan === "Free") return false;
  return new Date() > this.planExpiresAt;
};

UserSchema.methods.canUseLinkedInOptimization = function (): boolean {
  if (this.linkedinPaid) return true;
  return ["Basic", "Advanced", "Professional"].includes(this.plan);
};

// ── Pre-save hooks ────────────────────────────────────────────────────────────

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("plan")) {
    const oldLimit = this.downloadLimit;

   switch (this.plan) {
  case "Trial":
  this.downloadLimit = 1;
  this.jdEnhancementLimit = 0;
  this.resumeUploadLimit = 1;
  break;
case "Basic":
  this.downloadLimit = 5;
  this.jdEnhancementLimit = 5;
  this.resumeUploadLimit = 2;
  break;
case "Advanced":
  this.downloadLimit = 10;
  this.jdEnhancementLimit = 10;
  this.resumeUploadLimit = 3;
  break;
case "Professional":
  this.downloadLimit = 15;
  this.jdEnhancementLimit = 15;
  this.resumeUploadLimit = 5;
  break;
default:
  this.downloadLimit = 0;       
  this.jdEnhancementLimit = 1;   
  this.resumeUploadLimit = 9999; 
   }

    if (oldLimit !== this.downloadLimit && this.downloadLimit > 0) {
      this.downloadCount = 0;
      this.lastDownloadReset = new Date();
      this.personalInfoEditCount = 0;
      this.personalInfoLocked = false;
      this.firstDownloadedResumeId = null;
      this.linkedinOptimizationCount = 0;
this.jdEnhancementCount = 0;
this.resumeUploadCount = 0;

      try {
        const Resume = mongoose.model("Resume");
        const result = await Resume.updateMany(
          { userId: this._id },
          {
            $set: { hasBeenDownloaded: false },
            $unset: { firstDownloadDate: 1 },
          }
        );
        console.log(
          `✨ Plan upgraded to ${this.plan}: ${result.modifiedCount} resumes reset`
        );
      } catch (error) {
        console.error("❌ Failed to reset resumes:", error);
      }
    }
  }
  next();
});

// ── Indexes ───────────────────────────────────────────────────────────────────

UserSchema.index({ role: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ isDeleted: 1 });

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;