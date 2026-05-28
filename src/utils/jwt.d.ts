export declare const signAccess: (userId: string) => string;
export declare const signRefresh: (userId: string) => string;
export declare const verifyAccess: (token: string) => {
    userId: string;
};
export declare const verifyRefresh: (token: string) => {
    userId: string;
};
//# sourceMappingURL=jwt.d.ts.map