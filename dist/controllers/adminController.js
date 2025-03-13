"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const inviteService_1 = require("../services/inviteService");
class AdminController {
    /**
     * Get all invite codes with usage data
     */
    static async getAllCodes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await inviteService_1.InviteService.getAllCodes(page, limit);
            return res.status(200).json({
                success: true,
                data: result.codes,
                meta: result.meta
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: error
            });
        }
    }
    /**
     * Get usage data for a specific code
     */
    static async getCodeUsage(req, res) {
        try {
            const { codeId } = req.params;
            const usages = await inviteService_1.InviteService.getCodeUsage(codeId);
            return res.status(200).json({
                success: true,
                data: usages
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: error
            });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=adminController.js.map