import { Request, Response, NextFunction } from 'express';
export declare const getTasks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createTaskHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTaskHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTaskHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=taskController.d.ts.map