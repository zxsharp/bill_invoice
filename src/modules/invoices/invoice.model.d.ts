import { Schema, Types } from 'mongoose';
export declare const Invoice: import("mongoose").Model<{
    customer: string;
    items: Types.DocumentArray<{
        desc: string;
        qty: number;
        price: number;
    }, Types.Subdocument<import("mongodb").ObjectId, unknown, {
        desc: string;
        qty: number;
        price: number;
    }, {}, {}> & {
        desc: string;
        qty: number;
        price: number;
    }>;
    total: number;
    status: "draft" | "pending" | "paid" | "cancelled";
    owner?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    customer: string;
    items: Types.DocumentArray<{
        desc: string;
        qty: number;
        price: number;
    }, Types.Subdocument<import("mongodb").ObjectId, unknown, {
        desc: string;
        qty: number;
        price: number;
    }, {}, {}> & {
        desc: string;
        qty: number;
        price: number;
    }>;
    total: number;
    status: "draft" | "pending" | "paid" | "cancelled";
    owner?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    customer: string;
    items: Types.DocumentArray<{
        desc: string;
        qty: number;
        price: number;
    }, Types.Subdocument<import("mongodb").ObjectId, unknown, {
        desc: string;
        qty: number;
        price: number;
    }, {}, {}> & {
        desc: string;
        qty: number;
        price: number;
    }>;
    total: number;
    status: "draft" | "pending" | "paid" | "cancelled";
    owner?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    customer: string;
    items: Types.DocumentArray<{
        desc: string;
        qty: number;
        price: number;
    }, Types.Subdocument<import("mongodb").ObjectId, unknown, {
        desc: string;
        qty: number;
        price: number;
    }, {}, {}> & {
        desc: string;
        qty: number;
        price: number;
    }>;
    total: number;
    status: "draft" | "pending" | "paid" | "cancelled";
    owner?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    customer: string;
    items: Types.DocumentArray<{
        desc: string;
        qty: number;
        price: number;
    }, Types.Subdocument<import("mongodb").ObjectId, unknown, {
        desc: string;
        qty: number;
        price: number;
    }, {}, {}> & {
        desc: string;
        qty: number;
        price: number;
    }>;
    total: number;
    status: "draft" | "pending" | "paid" | "cancelled";
    owner?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    customer: string;
    items: Types.DocumentArray<{
        desc: string;
        qty: number;
        price: number;
    }, Types.Subdocument<import("mongodb").ObjectId, unknown, {
        desc: string;
        qty: number;
        price: number;
    }, {}, {}> & {
        desc: string;
        qty: number;
        price: number;
    }>;
    total: number;
    status: "draft" | "pending" | "paid" | "cancelled";
    owner?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    customer: string;
    items: Types.DocumentArray<{
        desc: string;
        qty: number;
        price: number;
    }, Types.Subdocument<import("mongodb").ObjectId, unknown, {
        desc: string;
        qty: number;
        price: number;
    }, {}, {}> & {
        desc: string;
        qty: number;
        price: number;
    }>;
    total: number;
    status: "draft" | "pending" | "paid" | "cancelled";
    owner?: Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    customer: string;
    items: Types.DocumentArray<{
        desc: string;
        qty: number;
        price: number;
    }, Types.Subdocument<import("mongodb").ObjectId, unknown, {
        desc: string;
        qty: number;
        price: number;
    }, {}, {}> & {
        desc: string;
        qty: number;
        price: number;
    }>;
    total: number;
    status: "draft" | "pending" | "paid" | "cancelled";
    owner?: Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=invoice.model.d.ts.map