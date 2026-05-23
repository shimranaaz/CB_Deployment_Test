import mongoose, { Schema } from "mongoose";
const TermsSchema = new Schema({
    section: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: String,
    },
}, { timestamps: true });
const Terms = mongoose.model("Terms", TermsSchema);
export default Terms;
