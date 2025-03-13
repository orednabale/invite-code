"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitUseCode = exports.limitGenerateCode = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
// Create separate rate limiters for different endpoints
const generateCodeLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 5, // 5 attempts
    duration: 60, // per minute
});
const useCodeLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 10, // 10 attempts
    duration: 60, // per minute
});
// Rate limit for generating codes
const limitGenerateCode = async (req, res, next) => {
    try {
        // Use IP as key
        const key = req.ip;
        await generateCodeLimiter.consume(key);
        next();
    }
    catch (error) {
        return res.status(429).json({
            success: false,
            error: 'Too many requests, please try again later'
        });
    }
};
exports.limitGenerateCode = limitGenerateCode;
// Rate limit for using codes
const limitUseCode = async (req, res, next) => {
    try {
        // Use IP as key
        const key = req.ip;
        await useCodeLimiter.consume(key);
        next();
    }
    catch (error) {
        return res.status(429).json({
            success: false,
            error: 'Too many attempts, please try again later'
        });
    }
};
exports.limitUseCode = limitUseCode;
//# sourceMappingURL=rateLimiter.js.map