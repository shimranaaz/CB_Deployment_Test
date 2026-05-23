import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITerms extends Document {
  section: string;
  content: string;
  lastUpdated: Date;
  updatedBy?: string;
  createdAt: Date;
}

const TermsSchema: Schema<ITerms> = new Schema(
  {
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
  },
  { timestamps: true }
);

const Terms: Model<ITerms> = mongoose.model<ITerms>("Terms", TermsSchema);

export default Terms;