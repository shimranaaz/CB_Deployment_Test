import { Request, Response } from 'express';
import Pricing from '../models/Pricing.js';

const defaultPlans = [
  {
    planKey: 'free',
    name: 'Free Forever',
    subtitle: 'Start building professional resumes at zero cost, forever.',
    price: 0,
    priceDisplay: '₹0',
    priceUnit: '/ Forever',
    description: 'Access essential features to create your first professional resume.',
    features: [
      { text: '2 Free resume templates (lifetime access)', included: true },
      { text: 'Basic editing and formatting tools', included: true },
      { text: 'Download in PDF format anytime', included: true },
      { text: 'No credit card required', included: true },
      { text: 'Premium templates', included: false },
      { text: 'AI suggestions and optimization', included: false },
      { text: 'Priority support', included: false },
    ],
    buttonText: 'Start Free',
    popular: false,
    isFree: true,
    order: 0,
  },
  {
    planKey: 'trial',
    name: 'Trial · 7 Days',
    subtitle: 'Test premium features with a quick 7-day trial before committing.',
    price: 99,
    priceDisplay: '₹99',
    priceUnit: '/ Resume',
    description: 'Get 7 days to explore premium templates and basic features.',
features: [
  { text: 'Download in PDF & Word', included: true },
  { text: '50+ Premium Templates', included: true },
  { text: 'AI Resume Enhancer', included: true },
  { text: 'Live ATS Score Tracking', included: true },
  { text: 'One Resume, Multiple ATS-Optimized Outputs ', included: true },
  { text: 'LinkedIn Profile Review', included: true },
],
    buttonText: 'Try Now',
    popular: false,
    isFree: false,
    order: 1,
  },
  {
    planKey: 'starter',
    name: 'Starter · 1 Month',
    subtitle: 'Perfect for quick, high‑stakes job hunts where every resume must stand out.',
    price: 399,
    priceDisplay: '₹399',
    priceUnit: '/ Resume',
    description: 'Get full access for 30 days to design, refine, and export job‑ready resumes.',
   features: [
  { text: 'Download in PDF & Word', included: true },
  { text: '50+ Premium Templates', included: true },
  { text: 'AI Resume Enhancer', included: true },
  { text: 'Live ATS Score Tracking', included: true },
  { text: 'One Resume, Multiple ATS-Optimized Outputs', included: true },
  { text: 'LinkedIn Profile Review', included: true },
],
    buttonText: 'Get Now',
    popular: false,
    isFree: false,
    order: 2,
  },
  {
    planKey: 'power',
    name: 'Power User · 3 Months',
    subtitle: 'Built for serious applicants who refuse to send the same resume twice.',
    price: 499,
    priceDisplay: '₹499',
    priceUnit: '/ Resume',
    description: 'Locked‑in access for 90 days to tune every resume for every role.',
  features: [
  { text: 'Download in PDF & Word', included: true },
  { text: '50+ Premium Templates', included: true },
  { text: 'AI Resume Enhancer', included: true },
  { text: 'Live ATS Score Tracking', included: true },
  { text: 'One Resume, Multiple ATS-Optimized Outputs', included: true },
  { text: 'LinkedIn Profile Review ', included: true },
],
    buttonText: 'Get Now',
    popular: true,
    isFree: false,
    order: 3,
  },
  {
    planKey: 'pro',
    name: 'Pro Member · 1 Year',
    subtitle: 'Designed for ambitious professionals who tweak and test all year long.',
    price: 999,
    priceDisplay: '₹999',
    priceUnit: '/ Resume',
    description: 'Build, test, and perfect your profile across the entire year.',
   features: [
  { text: 'Download in PDF & Word', included: true },
  { text: '50+ Premium Templates', included: true },
  { text: 'AI Resume Enhancer', included: true },
  { text: 'Live ATS Score Tracking', included: true },
  { text: 'One Resume, Multiple ATS-Optimized Outputs', included: true },
  { text: 'LinkedIn Profile Review', included: true },
],
    buttonText: 'Get Now',
    popular: false,
    isFree: false,
    order: 4,
  },


  {
  planKey: 'linkedin',
  name: 'LinkedIn Optimization',
  subtitle: 'Get your LinkedIn profile professionally optimized.',
  price: 199,
  priceDisplay: '₹199',
  priceUnit: '/ One-time',
  description: 'One-time LinkedIn profile optimization service.',
  features: [
    { text: 'LinkedIn Profile Review', included: true },
    { text: 'Headline & Summary Rewrite', included: true },
    { text: 'Keyword Optimization for Recruiters', included: true },
    { text: '3 Optimization Sessions', included: true },
    { text: 'Profile Strength Score', included: true },
  ],
  buttonText: 'Get Now',
  popular: false,
  isFree: false,
  order: 5,
},

];

// GET /api/pricing — public
export const getAllPricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = await Pricing.find().sort({ order: 1 });
    res.status(200).json({ success: true, plans });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch pricing' });
  }
};

// PUT /api/pricing/:planKey — admin only
export const updatePricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planKey } = req.params;
    const updateData = { ...req.body, lastUpdated: new Date() };

    const plan = await Pricing.findOneAndUpdate(
      { planKey },
      updateData,
      { new: true, runValidators: true }
    );

    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Plan updated successfully', plan });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update pricing' });
  }
};

// POST /api/pricing/initialize — admin only
// NEW
export const initializePricing = async (req: Request, res: Response): Promise<void> => {
  try {
    for (const plan of defaultPlans) {
      await Pricing.findOneAndUpdate(
        { planKey: plan.planKey },
        { $set: plan },
        { upsert: true, new: true }
      );
    }
    res.status(200).json({ success: true, message: 'Pricing initialized successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to initialize pricing' });
  }
};

// POST /api/pricing/add — admin only
export const addPricingPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planKey, name, subtitle, price, priceUnit, description, features, buttonText, popular, isFree, order } = req.body;

    if (!planKey || !name || price === undefined) {
      res.status(400).json({ message: 'planKey, name and price are required' });
      return;
    }

    const existing = await Pricing.findOne({ planKey });
    if (existing) {
      res.status(400).json({ message: `Plan with key "${planKey}" already exists` });
      return;
    }

    const newPlan = new Pricing({
      planKey,
      name,
      subtitle: subtitle || '',
      price,
      priceDisplay: `₹${price}`,
      priceUnit: priceUnit || '/ Resume',
      description: description || '',
      features: features || [],
      buttonText: buttonText || 'Get Now',
      popular: popular || false,
      isFree: isFree || false,
      order: order ?? (await Pricing.countDocuments()),
      lastUpdated: new Date(),
    });

    await newPlan.save();
    res.status(201).json({ success: true, message: 'Plan added successfully', plan: newPlan });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to add plan' });
  }
};

// DELETE /api/pricing/:planKey — admin only
export const deletePricingPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planKey } = req.params;

    const plan = await Pricing.findOneAndDelete({ planKey });

    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Plan deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete plan' });
  }
};