import jwt      from 'jsonwebtoken';
import bcrypt   from 'bcrypt';
import config   from '@/config';
import knex     from '@/db';
import { User } from '@/interfaces';
import { Request, Response, NextFunction } from 'express';


export async function createUser(
    firstname: string,
    lastname:  string,
    email:     string,
    password:  string
): Promise<User> {
    try {
        //XXX Temporary
        const [users] = await knex('users').count('*');
        if ( users.count > 1 ) throw new Error('Only one user supported for now.');

        const hash   = await bcrypt.hash(password, config.saltRounds);
        const [user] = await knex<User>('users')
        .insert({
            firstname,
            lastname,
            email,
            password: hash
        })
        .returning(['firstname', 'lastname', 'email'])
        return user;
    } catch (e) {
        throw e;
    }
}

export async function login(email: string, password: string): Promise<{user: User, token: string}> {
    try {
        const [user] = await knex('users')
        .select(['firstname','lastname','email','password'])
        .where({email})
        if ( !user ) throw new Error('User does not exist');
        const match = await bcrypt.compare(password, user.password!);
        if ( match ) {
            delete user.password;
            return user;
        }
        throw new Error('Invalid password');
    } catch (e) {
        console.log(e)
        throw e
    }
}


function generateAccessToken(username: string) {
    return jwt.sign({username}, config.TOKEN_SECRET, { expiresIn: '30d' });
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
