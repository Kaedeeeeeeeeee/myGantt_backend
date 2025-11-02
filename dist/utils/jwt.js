import jwt from 'jsonwebtoken';
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return secret;
};
const getJwtRefreshSecret = () => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    return secret;
};
export const generateAccessToken = (payload) => {
    const secret = getJwtSecret();
    const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
    return jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    });
};
export const generateRefreshToken = (payload) => {
    const secret = getJwtRefreshSecret();
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, getJwtSecret());
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, getJwtRefreshSecret());
};
//# sourceMappingURL=jwt.js.map