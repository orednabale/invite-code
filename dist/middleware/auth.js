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
exports.requireAdmin = exports.authenticate = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-jwt-secret');
        const userRepo = (0, typeorm_1.getRepository)(User_1.User);
        const user = await userRepo.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }
        // Add user to request object
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
};
exports.authenticate = authenticate;
// Admin-only middleware
const requireAdmin = async (req, res, next) => {
    try {
        // authenticate middleware should run before this
        const user = req.user;
        if (!user || !user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }
        next();
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map