import { Request, Response, NextFunction } from 'express';
/**
 * 创建项目邀请
 * POST /api/projects/:projectId/invitations
 */
export declare const createInvitationHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 获取邀请详情（通过令牌）
 * GET /api/invitations/:token
 */
export declare const getInvitationHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 接受邀请
 * POST /api/invitations/:token/accept
 */
export declare const acceptInvitationHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 拒绝邀请
 * POST /api/invitations/:token/reject
 */
export declare const rejectInvitationHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 取消邀请
 * DELETE /api/invitations/:id
 */
export declare const cancelInvitationHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 获取项目的所有邀请
 * GET /api/projects/:projectId/invitations
 */
export declare const getProjectInvitationsHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 获取当前用户的待处理邀请
 * GET /api/invitations/pending
 */
export declare const getUserPendingInvitationsHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=invitationController.d.ts.map