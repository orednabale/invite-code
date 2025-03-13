import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create separate rate limiters for different endpoints
const generateCodeLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60, // per minute
});

const validateCodeLimiter = new RateLimiterMemory({
  points: 10, // 10 attempts
  duration: 60, // per minute
});

const useCodeLimiter = new RateLimiterMemory({
  points: 10, // 10 attempts
  duration: 60, // per minute
});

// Rate limit for generating codes
export const limitGenerateCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use IP as key
    const key: any = req.ip;
    await generateCodeLimiter.consume(key);
    next();
  } catch (error) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later'
    });
  }
};

// Rate limit for validating codes
export const limitValidateCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use IP as key
    const key: any = req.ip;
    await useCodeLimiter.consume(key);
    next();
  } catch (error) {
    return res.status(429).json({
      success: false,
      error: 'Too many attempts, please try again later'
    });
  }
};

// Rate limit for using codes
export const limitUseCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use IP as key
    const key: any = req.ip;
    await useCodeLimiter.consume(key);
    next();
  } catch (error) {
    return res.status(429).json({
      success: false,
      error: 'Too many attempts, please try again later'
    });
  }
};

