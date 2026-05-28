"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../../middleware/validate");
const auth_schema_1 = require("./auth.schema");
const auth_controller_1 = require("./auth.controller");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const requireAuth_1 = require("../../middleware/requireAuth");
const router = (0, express_1.Router)();
router.use((0, cookie_parser_1.default)());
router.post('/register', (0, validate_1.validate)(auth_schema_1.registerSchema), auth_controller_1.register);
router.post('/login', (0, validate_1.validate)(auth_schema_1.loginSchema), auth_controller_1.login);
router.post('/refresh', auth_controller_1.refresh);
router.post('/logout', auth_controller_1.logout);
router.get('/me', requireAuth_1.requireAuth, auth_controller_1.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map