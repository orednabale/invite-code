"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inviteController_1 = require("../controllers/inviteController");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Generate a new invite code (requires authentication)
router.post('/generate', auth_1.authenticate, rateLimiter_1.limitGenerateCode, inviteController_1.InviteController.generateCode);
// Use an invite code (public endpoint but rate limited)
router.post('/use', rateLimiter_1.limitUseCode, inviteController_1.InviteController.useCode);
exports.default = router;
//# sourceMappingURL=inviteRoutes.js.map