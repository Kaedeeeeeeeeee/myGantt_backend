import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { ProjectRole } from '../middleware/projectPermission.js';
/**
 * 检查用户是否有项目访问权限
 */
const checkProjectAccess = async (projectId, userId) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            OR: [
                { userId },
                { members: { some: { userId } } },
            ],
        },
    });
    return !!project;
};
/**
 * 检查用户是否有编辑权限（EDITOR及以上）
 */
const checkEditPermission = async (projectId, userId) => {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            members: {
                where: { userId },
            },
        },
    });
    if (!project) {
        throw new AppError('Project not found', 404);
    }
    // 项目所有者自动拥有编辑权限
    if (project.userId === userId) {
        return;
    }
    // 检查成员权限
    const member = project.members[0];
    if (!member) {
        throw new AppError('Access denied', 403);
    }
    const role = member.role;
    if (role !== ProjectRole.EDITOR && role !== ProjectRole.ADMIN && role !== ProjectRole.OWNER) {
        throw new AppError('Insufficient permissions. Editor role required', 403);
    }
};
export const getTasksByProjectId = async (projectId, userId) => {
    // 使用权限检查替代userId检查
    const hasAccess = await checkProjectAccess(projectId, userId);
    if (!hasAccess) {
        throw new AppError('Project not found', 404);
    }
    const tasks = await prisma.task.findMany({
        where: { projectId },
        include: {
            dependencies: {
                include: {
                    dependsOnTask: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: { startDate: 'asc' },
    });
    // Transform dependencies to match frontend format
    return tasks.map(task => ({
        ...task,
        dependencies: task.dependencies.map(dep => dep.dependsOnTaskId),
    }));
};
export const getTaskById = async (taskId, userId) => {
    // 使用权限检查
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            project: {
                OR: [
                    { userId },
                    { members: { some: { userId } } },
                ],
            },
        },
        include: {
            dependencies: {
                include: {
                    dependsOnTask: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
    if (!task) {
        throw new AppError('Task not found', 404);
    }
    return {
        ...task,
        dependencies: task.dependencies.map(dep => dep.dependsOnTaskId),
    };
};
export const createTask = async (projectId, userId, data) => {
    // 验证EDITOR及以上权限
    await checkEditPermission(projectId, userId);
    const { dependencies, ...taskData } = data;
    const task = await prisma.task.create({
        data: {
            projectId,
            ...taskData,
            progress: taskData.progress ?? 0,
        },
    });
    // Create dependencies if provided
    if (dependencies && dependencies.length > 0) {
        // Verify all dependency tasks exist and belong to the same project
        const dependencyTasks = await prisma.task.findMany({
            where: {
                id: { in: dependencies },
                projectId,
            },
        });
        if (dependencyTasks.length !== dependencies.length) {
            throw new AppError('Some dependency tasks not found', 400);
        }
        await prisma.taskDependency.createMany({
            data: dependencies.map(depId => ({
                taskId: task.id,
                dependsOnTaskId: depId,
            })),
            skipDuplicates: true,
        });
    }
    return await getTaskById(task.id, userId);
};
export const updateTask = async (taskId, userId, data) => {
    const task = await getTaskById(taskId, userId);
    // 验证EDITOR及以上权限
    await checkEditPermission(task.projectId, userId);
    const { dependencies, ...taskData } = data;
    await prisma.task.update({
        where: { id: taskId },
        data: taskData,
    });
    // Update dependencies if provided
    if (dependencies !== undefined) {
        // Delete existing dependencies
        await prisma.taskDependency.deleteMany({
            where: { taskId },
        });
        // Create new dependencies
        if (dependencies.length > 0) {
            // Verify all dependency tasks exist and belong to the same project
            const dependencyTasks = await prisma.task.findMany({
                where: {
                    id: { in: dependencies },
                    projectId: task.projectId,
                },
            });
            if (dependencyTasks.length !== dependencies.length) {
                throw new AppError('Some dependency tasks not found', 400);
            }
            await prisma.taskDependency.createMany({
                data: dependencies.map(depId => ({
                    taskId,
                    dependsOnTaskId: depId,
                })),
                skipDuplicates: true,
            });
        }
    }
    return await getTaskById(taskId, userId);
};
export const deleteTask = async (taskId, userId) => {
    const task = await getTaskById(taskId, userId);
    // 验证EDITOR及以上权限
    await checkEditPermission(task.projectId, userId);
    await prisma.task.delete({
        where: { id: taskId },
    });
    return task;
};
//# sourceMappingURL=taskService.js.map