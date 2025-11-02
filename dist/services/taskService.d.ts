export interface CreateTaskData {
    name: string;
    startDate: Date;
    endDate: Date;
    progress?: number;
    color?: string;
    assignee?: string;
    description?: string;
    dependencies?: string[];
}
export interface UpdateTaskData {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    progress?: number;
    color?: string;
    assignee?: string;
    description?: string;
    dependencies?: string[];
}
export declare const getTasksByProjectId: (projectId: string, userId: string) => Promise<{
    dependencies: string[];
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    color: string | null;
    assignee: string | null;
    description: string | null;
}[]>;
export declare const getTaskById: (taskId: string, userId: string) => Promise<{
    dependencies: string[];
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    color: string | null;
    assignee: string | null;
    description: string | null;
}>;
export declare const createTask: (projectId: string, userId: string, data: CreateTaskData) => Promise<{
    dependencies: string[];
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    color: string | null;
    assignee: string | null;
    description: string | null;
}>;
export declare const updateTask: (taskId: string, userId: string, data: UpdateTaskData) => Promise<{
    dependencies: string[];
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    color: string | null;
    assignee: string | null;
    description: string | null;
}>;
export declare const deleteTask: (taskId: string, userId: string) => Promise<{
    dependencies: string[];
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    color: string | null;
    assignee: string | null;
    description: string | null;
}>;
//# sourceMappingURL=taskService.d.ts.map