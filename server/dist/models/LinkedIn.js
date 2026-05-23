import mongoose, { Schema } from 'mongoose';
const LinkedInSchema = new Schema({
    username: { type: String, required: true, trim: true },
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    linkedinUrl: { type: String, default: null },
    targetRole: { type: String, default: null },
    linkedinScore: { type: Number, required: true, min: 0, max: 100 },
    profileStrength: { type: String, required: true },
    userData: { type: Schema.Types.Mixed, required: true, default: {} },
    detailedReport: { type: Schema.Types.Mixed, required: true, default: {} },
    recruiterVisibility: { type: Schema.Types.Mixed, default: {} },
    contentIntelligence: { type: Schema.Types.Mixed, default: {} },
    careerAlignment: { type: Schema.Types.Mixed, default: {} },
    profileFixData: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });
const LinkedIn = mongoose.model('LinkedIn', LinkedInSchema, 'linkedins');
export default LinkedIn;
