import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { sendFeedback } from '../controllers/feedbackController.js';

const router = Router();

// 反馈路由需要认证
router.use(authenticate);

router.post('/', sendFeedback);

export default router;

