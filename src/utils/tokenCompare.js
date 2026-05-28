"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeCompare = safeCompare;
const crypto_1 = __importDefault(require("crypto"));
function safeCompare(a, b) {
    if (a.length !== b.length)
        return false;
    return crypto_1.default.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
//# sourceMappingURL=tokenCompare.js.map