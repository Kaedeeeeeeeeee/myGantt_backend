import { Router } from 'express';
import { googleAuth, refreshToken, logout, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
// Public routes
router.post('/google', googleAuth);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
// Protected routes
router.get('/me', authenticate, getCurrentUser);
export default router;
//# sourceMappingURL=auth.js.map