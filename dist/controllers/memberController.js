import { getProjectMembers, updateMemberRole, removeMember, } from '../services/memberService.js';
import { ProjectRole } from '../middleware/projectPermission.js';
import { AppError } from '../middleware/errorHandler.js';
/**
 * 获取项目成员列表
 * GET /api/projects/:projectId/members
 */
export const getProjectMembersHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        const { projectId } = req.params;
        const members = await getProjectMembers(projectId, req.user.userId);
        res.json({
            status: 'success',
            data: members,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * 更新成员权限
 * PUT /api/projects/:projectId/members/:userId
 */
export const updateMemberRoleHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        const { projectId, userId } = req.params;
        const { role } = req.body;
        if (!role || !Object.values(ProjectRole).includes(role)) {
            throw new AppError('Valid role is required', 400);
        }
        if (role === ProjectRole.OWNER) {
            throw new AppError('Cannot assign OWNER role via this endpoint', 400);
        }
        const data = {
            role: role,
        };
        const updatedMember = await updateMemberRole(projectId, userId, req.user.userId, data);
        res.json({
            status: 'success',
            data: updatedMember,
            message: 'Member role updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * 移除成员
 * DELETE /api/projects/:projectId/members/:userId
 */
export const removeMemberHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        const { projectId, userId } = req.params;
        await removeMember(projectId, userId, req.user.userId);
        res.json({
            status: 'success',
            message: 'Member removed successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=memberController.js.map