"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Admin routes (require admin authentication)
router.get('/codes', auth_1.authenticate, auth_1.requireAdmin, adminController_1.AdminController.getAllCodes);
router.get('/codes/:codeId/usage', auth_1.authenticate, auth_1.requireAdmin, adminController_1.AdminController.getCodeUsage);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map