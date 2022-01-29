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
    const txn = await knex.transaction();
    try {
        //XXX Temporary
        const [users] = await txn('users').count('*');
        if ( users.count > 1 ) throw new Error('Only one user supported for now.');

        const hash   = await bcrypt.hash(password, config.saltRounds);
        const [user] = await txn<User>('users')
        .insert({
            firstname,
            lastname,
            email,
            password: hash
        })
        .returning(['firstname', 'lastname', 'email'])

        if ( users.count == 0 ) {
            await txn('__flags__')
            .update({value:true})
            .where({key:'setup'})
        }

        await txn.commit();
        return user;
    } catch (e) {
        await txn.rollback();
        throw e;
    }
}

export async function login(email: string, password: string): Promise<User> {
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


export function generateAccessToken(username: string) {
    return jwt.sign({username}, config.TOKEN_SECRET, { expiresIn: '30d' });
}

export async function _authenticateToken(token: string) {
    return await jwt.verify(token, config.TOKEN_SECRET)
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token || '';
        if (!token) return res.sendStatus(401);
        const user = await _authenticateToken(token);
        req.user = user
        next()
    } catch (e) {
        console.log(e);
        //XXX TODO diff codes for required status / groups 
        return res.sendStatus(401)
    }
}
