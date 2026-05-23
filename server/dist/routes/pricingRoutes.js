import express from 'express';
import { getAllPricing, updatePricing, initializePricing, addPricingPlan, deletePricingPlan } from '../controllers/pricingController.js';
import protect from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminMiddleware.js';
const pricingRouter = express.Router();
pricingRouter.get('/', getAllPricing); // public
pricingRouter.post('/initialize', protect, adminOnly, initializePricing); // admin
pricingRouter.post('/add', protect, adminOnly, addPricingPlan); // admin
pricingRouter.put('/:planKey', protect, adminOnly, updatePricing); // admin
pricingRouter.delete('/:planKey', protect, adminOnly, deletePricingPlan); // admin
console.log('✅ Pricing routes registered successfully');
export default pricingRouter;
