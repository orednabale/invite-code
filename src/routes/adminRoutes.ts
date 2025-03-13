import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Admin routes (require admin authentication)
router.get('/codes', authenticate, requireAdmin, AdminController.getAllCodes);
router.get('/codes/:codeId/usage', authenticate, requireAdmin, AdminController.getCodeUsage);

export default router;
