import jwt    from 'jsonwebtoken';
import config from '@/config';
import { Request, Response, NextFunction } from 'express';


export function generateAccessToken(username: string) {
    return jwt.sign(username, config.TOKEN_SECRET, { expiresIn: '1800s' });
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token      = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, config.TOKEN_SECRET, (err: any, user: any) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}
