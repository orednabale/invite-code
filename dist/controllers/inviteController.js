"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteController = void 0;
const inviteService_1 = require("../services/inviteService");
class InviteController {
    /**
     * Generate a new invite code
     */
    static async generateCode(req, res) {
        try {
            const { maxUses = 1, expiryDays = 30 } = req.body;
            // Get user from JWT token (authentication middleware sets req.user)
            const userId = req.user.id;
            const invite = await inviteService_1.InviteService.generateCode(userId, maxUses, expiryDays);
            return res.status(201).json({
                success: true,
                data: {
                    code: invite.code,
                    maxUses: invite.maxUses,
                    expiresAt: invite.expiresAt
                }
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                error: error
            });
        }
    }
    /**
     * Validate and use an invite code
     */
    static async useCode(req, res) {
        try {
            const { code, email } = req.body;
            if (!code || !email) {
                return res.status(400).json({
                    success: false,
                    error: 'Code and email are required'
                });
            }
            // Get IP address and user agent
            const ipAddress = req.ip;
            const userAgent = req.headers['user-agent'];
            await inviteService_1.InviteService.useCode(code, email, ipAddress, userAgent);
            return res.status(200).json({
                success: true,
                message: 'Invite code used successfully'
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                error: error
            });
        }
    }
}
exports.InviteController = InviteController;
//# sourceMappingURL=inviteController.js.map