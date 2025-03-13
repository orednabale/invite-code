"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteService = void 0;
const typeorm_1 = require("typeorm");
const InviteCode_1 = require("../models/InviteCode");
const User_1 = require("../models/User");
const Usage_1 = require("../models/Usage");
const codeGenerator_1 = require("../utils/codeGenerator");
const uuid_1 = require("uuid");
class InviteService {
    /**
     * Generates a new invite code for a given user
     */
    static async generateCode(creatorId, maxUses = 1, expiryDays = 30) {
        const userRepo = (0, typeorm_1.getRepository)(User_1.User);
        const inviteRepo = (0, typeorm_1.getRepository)(InviteCode_1.InviteCode);
        const creator = await userRepo.findOne({ where: { id: creatorId } });
        if (!creator) {
            throw 'Creator not found';
        }
        // Generate unique salt for this invite
        const salt = (0, uuid_1.v4)();
        // Generate code using user's email and salt
        const code = codeGenerator_1.CodeGenerator.generateForEmail(creator.email, salt);
        // Calculate expiry date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiryDays);
        // Create and save the new invite code
        const invite = new InviteCode_1.InviteCode();
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
    static async useCode(code, userEmail, ipAddress, userAgent) {
        const userRepo = (0, typeorm_1.getRepository)(User_1.User);
        const inviteRepo = (0, typeorm_1.getRepository)(InviteCode_1.InviteCode);
        const usageRepo = (0, typeorm_1.getRepository)(Usage_1.Usage);
        // Start transaction to ensure atomicity
        const queryRunner = (0, typeorm_1.getRepository)(InviteCode_1.InviteCode).manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Check if user has already used an invite code
            let user = await userRepo.findOne({ where: { email: userEmail } });
            if (user && (await usageRepo.findOne({ where: { user: { id: user.id } } }))) {
                throw 'User has already used an invite code';
            }
            // Find invite code with locking to prevent race conditions
            const invite = await queryRunner.manager.findOne(InviteCode_1.InviteCode, {
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
                user = new User_1.User();
                user.email = userEmail;
                user.referrer = invite.creator;
                user = await queryRunner.manager.save(user);
            }
            // Record usage
            const usage = new Usage_1.Usage();
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    /**
     * Get all codes for admin view
     */
    static async getAllCodes(page = 1, limit = 20) {
        const inviteRepo = (0, typeorm_1.getRepository)(InviteCode_1.InviteCode);
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
    static async getCodeUsage(codeId) {
        const usageRepo = (0, typeorm_1.getRepository)(Usage_1.Usage);
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
exports.InviteService = InviteService;
//# sourceMappingURL=inviteService.js.map