"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertOwnership = assertOwnership;
const mongoose_1 = require("mongoose");
async function assertOwnership(ModelClass, resourceId, userId) {
    const doc = await ModelClass.findOne({
        _id: new mongoose_1.Types.ObjectId(resourceId),
        userId: new mongoose_1.Types.ObjectId(userId),
        isDeleted: false
    });
    if (!doc) {
        const err = new Error('Resource not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
    }
    return doc;
}
//# sourceMappingURL=ownershipCheck.js.map