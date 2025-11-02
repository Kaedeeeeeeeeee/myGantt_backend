import { Request, Response, NextFunction } from 'express';
import { sendFeedbackEmail } from '../services/emailService.js';
import { AppError } from '../middleware/errorHandler.js';

export const sendFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { subject, content } = req.body;

    // 验证必填字段
    if (!subject || !content) {
      throw new AppError('Subject and content are required', 400);
    }

    // 验证长度
    if (subject.length > 200) {
      throw new AppError('Subject must be less than 200 characters', 400);
    }

    if (content.length > 5000) {
      throw new AppError('Content must be less than 5000 characters', 400);
    }

    // 发送邮件
    await sendFeedbackEmail(
      req.user.email,
      req.user.name || null,
      subject.trim(),
      content.trim()
    );

    res.json({
      status: 'success',
      message: 'Feedback sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

