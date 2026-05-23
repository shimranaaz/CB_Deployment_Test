import mongoose, { Document, Schema, Model } from "mongoose";

export interface IEbook extends Document {
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  fileSize: string;
  isFree: boolean;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EbookSchema: Schema<IEbook> = new Schema(
  {
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
  },
  { timestamps: true }
);

const Ebook: Model<IEbook> = mongoose.model<IEbook>("Ebook", EbookSchema);

export default Ebook;