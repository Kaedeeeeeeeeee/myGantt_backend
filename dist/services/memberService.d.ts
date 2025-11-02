import { ProjectRole } from '../middleware/projectPermission.js';
export interface ProjectMemberResponse {
    id: string;
    projectId: string;
    userId: string;
    role: ProjectRole;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
    };
}
export interface UpdateMemberRoleData {
    role: ProjectRole;
}
/**
 * 获取项目成员列表
 */
export declare const getProjectMembers: (projectId: string, userId: string) => Promise<ProjectMemberResponse[]>;
/**
 * 获取用户在项目中的角色
 */
export declare const getUserProjectRole: (projectId: string, userId: string) => Promise<ProjectRole | null>;
/**
 * 检查用户是否有项目访问权限
 */
export declare const checkProjectAccess: (projectId: string, userId: string) => Promise<boolean>;
/**
 * 更新成员权限
 */
export declare const updateMemberRole: (projectId: string, targetUserId: string, updaterUserId: string, data: UpdateMemberRoleData) => Promise<ProjectMemberResponse>;
/**
 * 移除成员
 */
export declare const removeMember: (projectId: string, targetUserId: string, removerUserId: string) => Promise<void>;
//# sourceMappingURL=memberService.d.ts.map