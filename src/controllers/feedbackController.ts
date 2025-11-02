import { Request, Response, NextFunction } from 'express';
import { sendFeedbackEmail } from '../services/emailService.js';
import { AppError } from '../middleware/errorHandler.js';
import prisma from '../config/database.js';

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

    // 从数据库获取用户信息（包括name）
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true, name: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // 发送邮件
    await sendFeedbackEmail(
      user.email,
      user.name || null,
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

