import { Router } from 'express';
import { InviteController } from '../controllers/inviteController';
import { authenticate } from '../middleware/auth';
import { limitGenerateCode, limitValidateCode, limitUseCode } from '../middleware/rateLimiter';

const router = Router();

// Generate a new invite code (requires authentication)
router.post('/generate', authenticate, limitGenerateCode, InviteController.generateCode);

// Validate an invite code (public endpoint but rate limited)
router.get('/validate', limitValidateCode, InviteController.validateCode);

// Use an invite code (public endpoint but rate limited)
router.post('/use', limitUseCode, InviteController.useCode);

export default router;



