"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Generates an invite code based on email
 * Uses HMAC-SHA256 with a secret key, then converts to a readable format
 * Creates codes that are:
 * - Deterministic for the same email (for admin tracking)
 * - Hard to guess (relies on a server-side secret)
 * - Easy to type (alphanumeric with configurable length)
 */
class CodeGenerator {
    /**
     * Generates an invite code based on email and a salt
     * @param email The email to generate code for
     * @param salt Random salt to make codes unique even for same email
     * @returns A readable invite code
     */
    static generateForEmail(email, salt) {
        // Create HMAC using the email, salt and secret key
        const hmac = crypto.createHmac('sha256', this.SECRET_KEY);
        hmac.update(`${email.toLowerCase()}:${salt}`);
        const hash = hmac.digest('hex');
        // Convert to a readable format using our alphabet
        let code = '';
        for (let i = 0; i < this.CODE_LENGTH; i++) {
            const index = parseInt(hash.substring(i * 2, i * 2 + 2), 16) % this.ALPHABET.length;
            code += this.ALPHABET[index];
        }
        return code;
    }
    /**
     * Verifies if a given code matches what would be generated for the email
     * This isn't typically needed as we store codes in the database, but can be used
     * as an additional security measure
     */
    static verifyCode(email, salt, code) {
        const expectedCode = this.generateForEmail(email, salt);
        return expectedCode === code;
    }
}
exports.CodeGenerator = CodeGenerator;
CodeGenerator.SECRET_KEY = process.env.INVITE_CODE_SECRET || 'default-secret-change-in-production';
CodeGenerator.CODE_LENGTH = 8; // Configurable length
CodeGenerator.ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // No 0/O or 1/I for readability
//# sourceMappingURL=codeGenerator.js.map