import { Request, Response } from 'express';
import { InviteService } from '../services/inviteService';

export class AdminController {
  /**
   * Get all invite codes with usage data
   */
  public static async getAllCodes(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await InviteService.getAllCodes(page, limit);
      
      return res.status(200).json({
        success: true,
        data: result.codes,
        meta: result.meta
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error
      });
    }
  }
  
  /**
   * Get usage data for a specific code
   */
  public static async getCodeUsage(req: Request, res: Response) {
    try {
      const { codeId } = req.params;

      const usages = await InviteService.getCodeUsage(codeId);
      
      return res.status(200).json({
        success: true,
        data: usages
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error
      });
    }
  }
}

