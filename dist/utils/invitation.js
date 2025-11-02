/**
 * 生成邀请链接
 */
export const generateInvitationLink = (token) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    return `${frontendUrl}/invitation/${token}`;
};
//# sourceMappingURL=invitation.js.map