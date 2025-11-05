import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

// 订阅计划限制配置
export const SUBSCRIPTION_LIMITS = {
  [SubscriptionPlan.FREE]: {
    maxProjects: 5,
    maxMembersPerProject: 2, // 包括创建者本人
  },
  [SubscriptionPlan.BASIC]: {
    maxProjects: Infinity,
    maxMembersPerProject: 10,
  },
  [SubscriptionPlan.PRO]: {
    maxProjects: Infinity,
    maxMembersPerProject: 50,
  },
} as const;

// 定价配置（单位：USD，单位：分）
export const SUBSCRIPTION_PRICES = {
  [SubscriptionPlan.BASIC]: {
    monthly: 400, // $4.00
    yearly: 4000, // $40.00
    yearlyFirstTime: 1500, // $15.00 (首次年付折扣)
  },
  [SubscriptionPlan.PRO]: {
    monthly: 1000, // $10.00
    yearly: 10000, // $100.00
    yearlyFirstTime: 4000, // $40.00 (首次年付折扣)
  },
} as const;

/**
 * 获取用户的项目总数（包括作为成员参与的项目）
 */
export const getUserProjectCount = async (userId: string): Promise<number> => {
  const count = await prisma.project.count({
    where: {
      OR: [
        { userId },
        { members: { some: { userId } } },
      ],
    },
  });
  return count;
};

/**
 * 获取项目的成员总数（包括创建者）
 */
export const getProjectMemberCount = async (projectId: string): Promise<number> => {
  const count = await prisma.projectMember.count({
    where: { projectId },
  });
  // 创建者也算一个成员，所以返回 count + 1
  return count + 1;
};

/**
 * 检查用户是否可以创建新项目
 */
export const canUserCreateProject = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const limit = SUBSCRIPTION_LIMITS[user.subscriptionPlan as SubscriptionPlan];
  
  if (limit.maxProjects === Infinity) {
    return true;
  }

  const projectCount = await getUserProjectCount(userId);
  return projectCount < limit.maxProjects;
};

/**
 * 检查项目是否可以添加新成员
 * 注意：这里需要传入项目创建者的userId，因为限制是基于创建者的订阅计划
 */
export const canProjectAddMember = async (
  projectId: string,
  ownerUserId: string
): Promise<boolean> => {
  const owner = await prisma.user.findUnique({
    where: { id: ownerUserId },
    select: { subscriptionPlan: true },
  });

  if (!owner) {
    throw new AppError('Project owner not found', 404);
  }

  const limit = SUBSCRIPTION_LIMITS[owner.subscriptionPlan as SubscriptionPlan];
  
  if (limit.maxMembersPerProject === Infinity) {
    return true;
  }

  const memberCount = await getProjectMemberCount(projectId);
  return memberCount < limit.maxMembersPerProject;
};

/**
 * 获取用户可访问的项目列表（考虑降级限制）
 */
export const getUserAccessibleProjects = async (userId: string): Promise<string[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const limit = SUBSCRIPTION_LIMITS[user.subscriptionPlan as SubscriptionPlan];

  // 如果是无限计划，返回所有项目
  if (limit.maxProjects === Infinity) {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { userId },
          { members: { some: { userId } } },
        ],
      },
      select: { id: true },
    });
    return projects.map(p => p.id);
  }

  // 对于有限计划，只返回最近创建的N个项目
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { userId },
        { members: { some: { userId } } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: limit.maxProjects,
    select: { id: true },
  });

  return projects.map(p => p.id);
};

/**
 * 检查用户是否可以访问特定项目（考虑降级限制）
 */
export const canUserAccessProject = async (
  projectId: string,
  userId: string
): Promise<boolean> => {
  const accessibleProjects = await getUserAccessibleProjects(userId);
  return accessibleProjects.includes(projectId);
};

/**
 * 获取项目的可访问成员列表（考虑降级限制）
 * 对于降级的项目，只返回创建者和最早被邀请的成员
 */
export const getProjectAccessibleMembers = async (
  projectId: string,
  ownerUserId: string
): Promise<string[]> => {
  const owner = await prisma.user.findUnique({
    where: { id: ownerUserId },
    select: { subscriptionPlan: true },
  });

  if (!owner) {
    throw new AppError('Project owner not found', 404);
  }

  const limit = SUBSCRIPTION_LIMITS[owner.subscriptionPlan as SubscriptionPlan];

  // 如果是无限计划，返回所有成员
  if (limit.maxMembersPerProject === Infinity) {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      select: { userId: true },
    });
    return [ownerUserId, ...members.map(m => m.userId)];
  }

  // 对于有限计划，返回创建者 + 最早被邀请的成员
  const firstMember = await prisma.projectMember.findFirst({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
    select: { userId: true },
    take: limit.maxMembersPerProject - 1, // -1 因为创建者也算一个
  });

  const accessibleMembers = [ownerUserId];
  if (firstMember) {
    accessibleMembers.push(firstMember.userId);
  }

  return accessibleMembers;
};

/**
 * 检查用户是否是项目的可访问成员
 */
export const isUserAccessibleMember = async (
  projectId: string,
  userId: string,
  ownerUserId: string
): Promise<boolean> => {
  const accessibleMembers = await getProjectAccessibleMembers(projectId, ownerUserId);
  return accessibleMembers.includes(userId);
};

/**
 * 更新用户订阅计划
 */
export const updateUserSubscription = async (
  userId: string,
  plan: SubscriptionPlan,
  status: SubscriptionStatus,
  startDate?: Date,
  endDate?: Date,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionPlan: plan,
      subscriptionStatus: status,
      subscriptionStartDate: startDate || new Date(),
      subscriptionEndDate: endDate,
      stripeCustomerId,
      stripeSubscriptionId,
      isFirstTimeSubscriber: false,
    },
  });
};

