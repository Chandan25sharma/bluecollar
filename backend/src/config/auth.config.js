"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
