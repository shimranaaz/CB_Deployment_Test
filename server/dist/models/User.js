import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new Schema({
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
    atsScore: { type: Number, default: null },
    linkedinScore: { type: Number, default: null },
}, { timestamps: true });
UserSchema.methods.hasDownloadsRemaining = function () {
    if (this.plan === "Free")
        return true;
    return this.downloadCount < this.downloadLimit;
};
UserSchema.methods.incrementDownloadCount = async function () {
    this.downloadCount += 1;
    await this.save();
};
UserSchema.methods.resetDownloadCount = async function () {
    this.downloadCount = 0;
    this.lastDownloadReset = new Date();
    await this.save();
};
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
UserSchema.methods.isPlanExpired = function () {
    if (!this.planExpiresAt || this.plan === "Free")
        return false;
    return new Date() > this.planExpiresAt;
};
UserSchema.methods.canUseLinkedInOptimization = function () {
    if (this.linkedinPaid)
        return true;
    return ["Basic", "Advanced", "Professional"].includes(this.plan);
};
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.pre("save", async function (next) {
    if (this.isModified("plan")) {
        const oldLimit = this.downloadLimit;
        switch (this.plan) {
            case "Trial":
                this.downloadLimit = 1;
                break;
            case "Basic":
                this.downloadLimit = 1;
                break;
            case "Advanced":
                this.downloadLimit = 3;
                break;
            case "Professional":
                this.downloadLimit = 5;
                break;
            default:
                this.downloadLimit = 0;
        }
        if (oldLimit !== this.downloadLimit && this.downloadLimit > 0) {
            this.downloadCount = 0;
            this.lastDownloadReset = new Date();
            this.personalInfoEditCount = 0;
            this.personalInfoLocked = false;
            this.firstDownloadedResumeId = null;
            this.linkedinOptimizationCount = 0;
            try {
                const Resume = mongoose.model("Resume");
                const result = await Resume.updateMany({ userId: this._id }, {
                    $set: { hasBeenDownloaded: false },
                    $unset: { firstDownloadDate: 1 },
                });
                console.log(`✨ Plan upgraded to ${this.plan}: ${result.modifiedCount} resumes reset`);
            }
            catch (error) {
                console.error("❌ Failed to reset resumes:", error);
            }
        }
    }
    next();
});
UserSchema.index({ role: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ isDeleted: 1 });
const User = mongoose.model("User", UserSchema);
export default User;
