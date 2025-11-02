import { ProjectRole } from '../middleware/projectPermission.js';
export { ProjectRole };
export declare enum InvitationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export interface CreateInvitationData {
    inviteeEmail: string;
    role: ProjectRole;
}
export interface InvitationResponse {
    id: string;
    projectId: string;
    inviteeEmail: string;
    role: ProjectRole;
    token: string;
    status: InvitationStatus;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    inviter: {
        id: string;
        name: string | null;
        email: string;
        avatarUrl: string | null;
    };
    project: {
        id: string;
        name: string;
    };
}
/**
 * 创建项目邀请
 */
export declare const createInvitation: (projectId: string, inviterId: string, data: CreateInvitationData) => Promise<InvitationResponse>;
/**
 * 通过令牌获取邀请详情
 */
export declare const getInvitationByToken: (token: string) => Promise<{
    project: {
        id: string;
        name: string;
    };
    inviter: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    role: import(".prisma/client").$Enums.ProjectRole;
    inviterId: string;
    inviteeEmail: string;
    token: string;
    status: import(".prisma/client").$Enums.InvitationStatus;
    expiresAt: Date;
}>;
/**
 * 接受邀请
 */
export declare const acceptInvitation: (token: string, userId: string) => Promise<{
    projectId: string;
    role: import(".prisma/client").$Enums.ProjectRole;
} | {
    message: string;
    projectId: string;
}>;
/**
 * 拒绝邀请
 */
export declare const rejectInvitation: (token: string, userId: string) => Promise<{
    message: string;
    projectId: string;
}>;
/**
 * 取消邀请（仅邀请者或项目管理员可以取消）
 */
export declare const cancelInvitation: (invitationId: string, userId: string) => Promise<{
    message: string;
}>;
/**
 * 获取项目的所有邀请
 */
export declare const getProjectInvitations: (projectId: string, userId: string) => Promise<({
    inviter: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    role: import(".prisma/client").$Enums.ProjectRole;
    inviterId: string;
    inviteeEmail: string;
    token: string;
    status: import(".prisma/client").$Enums.InvitationStatus;
    expiresAt: Date;
})[]>;
/**
 * 获取用户的所有待处理邀请
 */
export declare const getUserPendingInvitations: (userId: string) => Promise<({
    project: {
        id: string;
        name: string;
    };
    inviter: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    role: import(".prisma/client").$Enums.ProjectRole;
    inviterId: string;
    inviteeEmail: string;
    token: string;
    status: import(".prisma/client").$Enums.InvitationStatus;
    expiresAt: Date;
})[]>;
/**
 * 清理过期邀请（可以设置为定时任务）
 */
export declare const cleanupExpiredInvitations: () => Promise<{
    updated: number;
}>;
//# sourceMappingURL=invitationService.d.ts.map