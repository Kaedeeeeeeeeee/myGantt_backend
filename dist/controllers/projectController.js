import { getProjectsByUserId, getProjectById, createProject, updateProject, deleteProject, } from '../services/projectService.js';
import { AppError } from '../middleware/errorHandler.js';
export const getAllProjects = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        const projects = await getProjectsByUserId(req.user.userId);
        res.json({
            status: 'success',
            data: projects,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getProject = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        const project = await getProjectById(req.params.id, req.user.userId);
        res.json({
            status: 'success',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createProjectHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new AppError('Project name is required', 400);
        }
        const project = await createProject(req.user.userId, { name: name.trim() });
        res.status(201).json({
            status: 'success',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateProjectHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        const { name } = req.body;
        if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
            throw new AppError('Project name must be a non-empty string', 400);
        }
        const data = {};
        if (name !== undefined) {
            data.name = name.trim();
        }
        const project = await updateProject(req.params.id, req.user.userId, data);
        res.json({
            status: 'success',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteProjectHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        await deleteProject(req.params.id, req.user.userId);
        res.json({
            status: 'success',
            message: 'Project deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=projectController.js.map