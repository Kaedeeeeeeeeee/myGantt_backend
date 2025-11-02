import { Request, Response, NextFunction } from 'express';
/**
 * 获取项目成员列表
 * GET /api/projects/:projectId/members
 */
export declare const getProjectMembersHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 更新成员权限
 * PUT /api/projects/:projectId/members/:userId
 */
export declare const updateMemberRoleHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 移除成员
 * DELETE /api/projects/:projectId/members/:userId
 */
export declare const removeMemberHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=memberController.d.ts.map