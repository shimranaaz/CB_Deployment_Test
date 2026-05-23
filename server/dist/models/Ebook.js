import mongoose, { Schema } from "mongoose";
const EbookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    coverImage: {
        type: String,
        default: "",
    },
    pdfUrl: {
        type: String,
        required: true,
        trim: true,
    },
    fileSize: {
        type: String,
        default: "",
        trim: true,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: "#2c2a63",
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const Ebook = mongoose.model("Ebook", EbookSchema);
export default Ebook;
