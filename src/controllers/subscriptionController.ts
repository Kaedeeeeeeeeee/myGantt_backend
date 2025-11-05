import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import {
  SUBSCRIPTION_LIMITS,
  SUBSCRIPTION_PRICES,
  SubscriptionPlan,
} from '../services/subscriptionService.js';
import prisma from '../config/database.js';

/**
 * 获取所有订阅计划信息
 */
export const getSubscriptionPlans = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 将 Infinity 转换为 "unlimited" 字符串，因为 JSON 无法序列化 Infinity
    const formatLimits = (limits: { maxProjects: number | typeof Infinity; maxMembersPerProject: number | typeof Infinity }) => {
      return {
        maxProjects: limits.maxProjects === Infinity ? 'unlimited' : limits.maxProjects,
        maxMembersPerProject: limits.maxMembersPerProject === Infinity ? 'unlimited' : limits.maxMembersPerProject,
      };
    };

    const plans = [
      {
        plan: SubscriptionPlan.FREE,
        name: 'Free',
        limits: formatLimits(SUBSCRIPTION_LIMITS[SubscriptionPlan.FREE]),
        price: null,
      },
      {
        plan: SubscriptionPlan.BASIC,
        name: 'Basic',
        limits: formatLimits(SUBSCRIPTION_LIMITS[SubscriptionPlan.BASIC]),
        monthlyPrice: SUBSCRIPTION_PRICES[SubscriptionPlan.BASIC].monthly,
        yearlyPrice: SUBSCRIPTION_PRICES[SubscriptionPlan.BASIC].yearly,
        yearlyFirstTimePrice: SUBSCRIPTION_PRICES[SubscriptionPlan.BASIC].yearlyFirstTime,
      },
      {
        plan: SubscriptionPlan.PRO,
        name: 'Pro',
        limits: formatLimits(SUBSCRIPTION_LIMITS[SubscriptionPlan.PRO]),
        monthlyPrice: SUBSCRIPTION_PRICES[SubscriptionPlan.PRO].monthly,
        yearlyPrice: SUBSCRIPTION_PRICES[SubscriptionPlan.PRO].yearly,
        yearlyFirstTimePrice: SUBSCRIPTION_PRICES[SubscriptionPlan.PRO].yearlyFirstTime,
      },
    ];

    res.json({
      status: 'success',
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取当前用户的订阅状态
 */
export const getCurrentSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // 安全获取订阅字段，如果不存在则使用默认值
    const subscriptionPlan = (user as any).subscriptionPlan || SubscriptionPlan.FREE;
    const subscriptionStatus = (user as any).subscriptionStatus || 'ACTIVE';
    const subscriptionStartDate = (user as any).subscriptionStartDate || null;
    const subscriptionEndDate = (user as any).subscriptionEndDate || null;
    const isFirstTimeSubscriber = (user as any).isFirstTimeSubscriber ?? true;

    // 将 Infinity 转换为 "unlimited" 字符串
    const formatLimits = (limits: { maxProjects: number | typeof Infinity; maxMembersPerProject: number | typeof Infinity }) => {
      return {
        maxProjects: limits.maxProjects === Infinity ? 'unlimited' : limits.maxProjects,
        maxMembersPerProject: limits.maxMembersPerProject === Infinity ? 'unlimited' : limits.maxMembersPerProject,
      };
    };

    res.json({
      status: 'success',
      data: {
        plan: subscriptionPlan,
        status: subscriptionStatus,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
        isFirstTimeSubscriber: isFirstTimeSubscriber,
        limits: formatLimits(SUBSCRIPTION_LIMITS[subscriptionPlan as SubscriptionPlan]),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建 Stripe Checkout Session
 * TODO: 集成 Stripe SDK
 */
export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { plan, period } = req.body; // period: 'monthly' | 'yearly'

    if (!plan || !period) {
      throw new AppError('Plan and period are required', 400);
    }

    if (plan === SubscriptionPlan.FREE) {
      throw new AppError('Cannot subscribe to free plan', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { isFirstTimeSubscriber: true, email: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // TODO: 集成 Stripe Checkout Session 创建逻辑
    // 这里需要安装 stripe 包：npm install stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // 
    // const price = period === 'yearly' && user.isFirstTimeSubscriber
    //   ? SUBSCRIPTION_PRICES[plan as SubscriptionPlan].yearlyFirstTime
    //   : period === 'yearly'
    //   ? SUBSCRIPTION_PRICES[plan as SubscriptionPlan].yearly
    //   : SUBSCRIPTION_PRICES[plan as SubscriptionPlan].monthly;
    //
    // const session = await stripe.checkout.sessions.create({ ... });

    res.json({
      status: 'success',
      message: 'Stripe integration pending',
      data: {
        plan,
        period,
        isFirstTime: user.isFirstTimeSubscriber && period === 'yearly',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Stripe Webhook 处理器
 * TODO: 集成 Stripe Webhook
 */
export const handleStripeWebhook = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 验证 Stripe webhook 签名
    // TODO: 处理订阅成功、取消、更新等事件
    // TODO: 更新用户订阅状态

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

