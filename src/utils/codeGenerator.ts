import * as crypto from 'crypto';

/**
 * Generates an invite code based on email
 * Uses HMAC-SHA256 with a secret key, then converts to a readable format
 * Creates codes that are: 
 * - Deterministic for the same email (for admin tracking)
 * - Hard to guess (relies on a server-side secret)
 * - Easy to type (alphanumeric with configurable length)
 */
export class CodeGenerator {
  private static readonly SECRET_KEY = process.env.INVITE_CODE_SECRET || 'default-secret-change-in-production';
  private static readonly CODE_LENGTH = 8; // Configurable length
  private static readonly ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // No 0/O or 1/I for readability

  /**
   * Generates an invite code based on email and a salt
   * @param email The email to generate code for
   * @param salt Random salt to make codes unique even for same email
   * @returns A readable invite code
   */
  public static generateForEmail(email: string, salt: string): string {
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
  public static verifyCode(email: string, salt: string, code: string): boolean {
    const expectedCode = this.generateForEmail(email, salt);
    return expectedCode === code;
  }
}

