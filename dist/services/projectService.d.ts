export interface CreateProjectData {
    name: string;
}
export interface UpdateProjectData {
    name?: string;
}
export declare const getProjectsByUserId: (userId: string) => Promise<{
    userRole: import(".prisma/client").$Enums.ProjectRole | null;
    members: {
        role: import(".prisma/client").$Enums.ProjectRole;
    }[];
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}[]>;
export declare const getProjectById: (projectId: string, userId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}>;
export declare const createProject: (userId: string, data: CreateProjectData) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}>;
export declare const updateProject: (projectId: string, userId: string, data: UpdateProjectData) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}>;
export declare const deleteProject: (projectId: string, userId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}>;
//# sourceMappingURL=projectService.d.ts.map