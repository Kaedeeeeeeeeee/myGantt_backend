export interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    picture: string;
}
export declare const findOrCreateUser: (googleUser: GoogleUserInfo) => Promise<{
    user: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const getUserById: (userId: string) => Promise<{
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    createdAt: Date;
}>;
//# sourceMappingURL=authService.d.ts.map