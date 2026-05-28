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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const Sentry = __importStar(require("@sentry/node"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
// Import routes here
const app = (0, express_1.default)();
if (env_1.env.SENTRY_DSN) {
    Sentry.init({ dsn: env_1.env.SENTRY_DSN });
    // app.use(Sentry.Handlers.requestHandler()); // Requires correct Express typing integration in Sentry v8
}
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGINS.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if (req.body)
        express_mongo_sanitize_1.default.sanitize(req.body);
    if (req.query)
        express_mongo_sanitize_1.default.sanitize(req.query);
    if (req.params)
        express_mongo_sanitize_1.default.sanitize(req.params);
    next();
});
if (env_1.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
const globalLimiter = (0, express_rate_limit_1.default)({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false });
app.use('/api', globalLimiter);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, data: { status: 'OK' } });
});
// Base route for easy verification in the browser
app.get('/', (req, res) => {
    res.send('<h2>✅ InvoiceList Backend is running properly!</h2><p>Use the /api/v1 endpoints to interact with the API.</p>');
});
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const invoice_routes_1 = __importDefault(require("./modules/invoices/invoice.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
if (env_1.env.SENTRY_DSN) {
    // app.use(Sentry.Handlers.errorHandler());
}
app.use('/api/v1/auth', auth_routes_1.default);
// Support legacy mount without versioning for backward compatibility
app.use('/api/auth', auth_routes_1.default);
// user routes can be added similarly when ready
app.use('/api/v1/invoices', invoice_routes_1.default);
// Support legacy singular invoice path for older clients
app.use('/api/invoice', invoice_routes_1.default);
// User routes
app.use('/api/v1/users', user_routes_1.default);
// Legacy user path
app.use('/api/users', user_routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map