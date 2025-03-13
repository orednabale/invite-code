import { getRepository } from 'typeorm';
import { InviteCode } from '../models/InviteCode';
import { User } from '../models/User';
import { Usage } from '../models/Usage';
import { CodeGenerator } from '../utils/codeGenerator';
import { v4 as uuidv4 } from 'uuid';

export class InviteService {
  /**
   * Generates a new invite code for a given user
   */
  public static async generateCode(
    creatorId: string, 
    maxUses: number = 1, 
    expiryDays: number = 30
  ): Promise<InviteCode> {
    const userRepo = getRepository(User);
    const inviteRepo = getRepository(InviteCode);
    
    const creator = await userRepo.findOne({ where: { id: creatorId } });
    if (!creator) {
      throw 'Creator not found';
    }
    
    // Generate unique salt for this invite
    const salt = uuidv4();
    
    // Generate code using user's email and salt
    const code = CodeGenerator.generateForEmail(creator.email, salt);
    
    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);
    
    // Create and save the new invite code
    const invite = new InviteCode();
    invite.code = code;
    invite.maxUses = maxUses;
    invite.creator = creator;
    invite.expiresAt = expiresAt;
    
    await inviteRepo.save(invite);
    return invite;
  }

  /**
   * Validates and uses an invite code
   */
   public static async validateCode(
    code: string, 
  ): Promise<boolean> {
    const userRepo = getRepository(User);
    const inviteRepo = getRepository(InviteCode);
    const usageRepo = getRepository(Usage);
    
    // Start transaction to ensure atomicity
    const queryRunner = getRepository(InviteCode).manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {

      // Find invite code 
      const invite = await queryRunner.manager.findOne(InviteCode, {
        where: { code, isActive: true },
        relations: ['creator'],
      });

      if (!invite) {
        throw 'Invalid invite code';
      }

      // Check if code has reached max uses
      if (invite.currentUses >= invite.maxUses) {
        throw 'Invite code has reached maximum uses';
      }
      
      // Check if code has expired
      if (invite.expiresAt < new Date()) {
        throw 'Invite code has expired';
      }
      
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }  

  /**
   * Validates and uses an invite code
   */
  public static async useCode(
    code: string, 
    userEmail: string,
    ipAddress: string | undefined,
    userAgent?: string
  ): Promise<boolean> {
    const userRepo = getRepository(User);
    const inviteRepo = getRepository(InviteCode);
    const usageRepo = getRepository(Usage);
    
    // Start transaction to ensure atomicity
    const queryRunner = getRepository(InviteCode).manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Check if user has already used an invite code
      let user = await userRepo.findOne({ where: { email: userEmail } });
      if (user && (await usageRepo.findOne({ where: { user: { id: user.id } } }))) {
        throw 'User has already used an invite code';
      }

      // Find invite code 
      const invite = await queryRunner.manager.findOne(InviteCode, {
        where: { code, isActive: true },
        relations: ['creator'],
      });

      if (!invite) {
        throw 'Invalid invite code';
      }

      // Check if code has reached max uses
      if (invite.currentUses >= invite.maxUses) {
        throw 'Invite code has reached maximum uses';
      }
      
      // Check if code has expired
      if (invite.expiresAt < new Date()) {
        throw 'Invite code has expired';
      }
      
      // If user doesn't exist, create one
      if (!user) {
        user = new User();
        user.email = userEmail;
        user.referrer = invite.creator;
        user = await queryRunner.manager.save(user);
      }
      
      // Record usage
      const usage = new Usage();
      usage.inviteCode = invite;
      usage.user = user;
      usage.usedIp = typeof ipAddress === 'string' ? ipAddress : '';
      usage.userAgent = typeof userAgent === 'string' ? userAgent : '';
      await queryRunner.manager.save(usage);
      
      // Increment usage count
      invite.currentUses += 1;
      await queryRunner.manager.save(invite);
      
      // If max uses reached, deactivate code
      if (invite.currentUses >= invite.maxUses) {
        invite.isActive = false;
        await queryRunner.manager.save(invite);
      }
      
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  
  /**
   * Get all codes for admin view
   */
  public static async getAllCodes(page: number = 1, limit: number = 20) {
    const inviteRepo = getRepository(InviteCode);
    
    const [codes, total] = await inviteRepo.findAndCount({
      relations: ['creator', 'usages', 'usages.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });
    
    return {
      codes,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  /**
   * Get tracking data for a specific code
   */
  public static async getCodeUsage(codeId: string) {
    const usageRepo = getRepository(Usage);
    
    const usages = await usageRepo.find({
      where: { inviteCode: { code: codeId } },
     relations: ['user'],
      order: {
        usedAt: 'DESC'
      }
    });
    
    return usages;
  }
}

