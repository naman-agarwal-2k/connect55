"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environments = {
    DEVELOPMENT: 'development',
    TEST: 'test',
    PRODUCTION: 'production',
    STAGE: 'stage'
};
const isActive = {
    FALSE: false,
    TRUE: 1,
};
const isDeleted = {
    FALSE: false,
    TRUE: 1,
};
const accessTokenExpiryDays = {
    EXPIRY_DAYS: 7
};
const passwordLength = 9;
const emailMaxSize = 60;
exports.default = {
    environments,
    isActive,
    isDeleted,
    passwordLength,
    accessTokenExpiryDays,
    emailMaxSize
};
