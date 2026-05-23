import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPricing extends Document {
  planKey: string;
  name: string;
  subtitle: string;
  price: number;
  priceDisplay: string;
  priceUnit: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  popular: boolean;
  isFree: boolean;
  order: number;
  lastUpdated: Date;
}

const PricingSchema: Schema<IPricing> = new Schema(
  {
    planKey:      { type: String, required: true, unique: true },
    name:         { type: String, required: true },
    subtitle:     { type: String, required: true },
    price:        { type: Number, required: true },
    priceDisplay: { type: String, required: true },
    priceUnit:    { type: String, required: true },
    description:  { type: String, required: true },
    features:     [{ text: { type: String }, included: { type: Boolean } }],
    buttonText:   { type: String, required: true },
    popular:      { type: Boolean, default: false },
    isFree:       { type: Boolean, default: false },
    order:        { type: Number, default: 0 },
    lastUpdated:  { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Pricing: Model<IPricing> = mongoose.model<IPricing>('Pricing', PricingSchema);
export default Pricing;