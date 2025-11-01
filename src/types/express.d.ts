import { TokenPayload } from '../utils/jwt.js';
import { ProjectRole } from '../middleware/projectPermission.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      projectRole?: ProjectRole;
    }
  }
}

export {};

