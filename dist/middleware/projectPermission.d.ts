import { Request, Response, NextFunction } from 'express';
export declare enum ProjectRole {
    VIEWER = "VIEWER",
    EDITOR = "EDITOR",
    ADMIN = "ADMIN",
    OWNER = "OWNER"
}
/**
 * 权限检查中间件
 * @param minRole 最小要求的权限级别
 */
export declare const requireProjectAccess: (minRole?: ProjectRole) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=projectPermission.d.ts.map