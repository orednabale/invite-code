import { Request, Response } from 'express';
import { InviteService } from '../services/inviteService';

export class InviteController {
  /**
   * Generate a new invite code
   */
  public static async generateCode(req: Request, res: Response) {
    try {
      const { maxUses = 1, expiryDays = 30 } = req.body;
      
      // Get user from JWT token (authentication middleware sets req.user)
      const userId = (req as any).user.id;
      
      const invite = await InviteService.generateCode(userId, maxUses, expiryDays);
      
      return res.status(201).json({
        success: true,
        data: {
          code: invite.code,
          maxUses: invite.maxUses,
          expiresAt: invite.expiresAt
        }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error
      });
    }
  }

  /**
   * Validate an invite code
   */
   public static async validateCode(req: Request, res: Response) {
    try {
      const { code} = req.body;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'Code required'
        });
      }
      
      // Get IP address and user agent
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];
      
      await InviteService.validateCode(code);
      
      return res.status(200).json({
        success: true,
        message: 'Invite code validated successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error
      });
    }
  }
  
  /**
   * Validate and use an invite code
   */
  public static async useCode(req: Request, res: Response) {
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
      
      await InviteService.useCode(code, email, ipAddress, userAgent);
      
      return res.status(200).json({
        success: true,
        message: 'Invite code used successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error
      });
    }
  }
}

