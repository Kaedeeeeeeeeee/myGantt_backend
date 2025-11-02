import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getInvitationHandler, acceptInvitationHandler, rejectInvitationHandler, cancelInvitationHandler, getUserPendingInvitationsHandler, } from '../controllers/invitationController.js';
const router = Router();
// 获取当前用户的待处理邀请（需要认证）
router.get('/pending', authenticate, getUserPendingInvitationsHandler);
// 通过令牌获取邀请详情（公开访问，用于查看邀请信息）
router.get('/:token', getInvitationHandler);
// 接受/拒绝邀请（需要认证）
router.post('/:token/accept', authenticate, acceptInvitationHandler);
router.post('/:token/reject', authenticate, rejectInvitationHandler);
// 取消邀请（需要认证）
router.delete('/:id', authenticate, cancelInvitationHandler);
export default router;
//# sourceMappingURL=invitations.js.map