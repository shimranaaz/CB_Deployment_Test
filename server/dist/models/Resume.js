import mongoose, { Schema } from "mongoose";
const ResumeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "digital-pro" },
    accent_color: { type: String, default: "#3B82F6" },
    professional_summary: { type: String, default: "" },
    skills: [{ type: String }],
    personal_info: {
        image: { type: String, default: "" },
        full_name: { type: String, default: "" },
        title: { type: String, default: "" },
        profession: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" },
    },
    experience: [
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
        },
    ],
    projects: [
        {
            name: { type: String },
            type: { type: String },
            description: { type: String },
        },
    ],
    education: [
        {
            institution: { type: String, default: "" },
            degree: { type: String, default: "" },
            field: { type: String, default: "" },
            start_date: { type: String, default: "" },
            end_date: { type: String, default: "" },
            gpa: { type: String, default: "" },
            additional_info: { type: String, default: "" },
            is_current: { type: Boolean, default: false },
        },
    ],
    additional_info: {
        certifications: { type: String, default: "" },
        languages: { type: String, default: "" },
        interests: { type: String, default: "" },
    },
    deletedUserInfo: {
        name: { type: String },
        email: { type: String },
        mobile: { type: String }
    },
    hasBeenDownloaded: {
        type: Boolean,
        default: false
    },
    firstDownloadDate: {
        type: Date
    },
    adminUploadedPdf: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    adminCreated: {
        type: Boolean,
        default: false,
    },
    createdByRole: {
        type: String,
        enum: ['user', 'admin', 'sales'],
        default: 'user',
    },
}, { timestamps: true, minimize: false });
const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;
