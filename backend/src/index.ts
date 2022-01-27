import 'module-alias/register';

import fs        from 'fs';
import path      from 'path';
import express   from 'express';
import logger    from '@/logger';
import config    from '@/config';
import knex      from '@/db';
import * as Auth from '@/core/auth';
import { User }  from '@/interfaces';

//Force UTC
const  pg    = require('pg');
const  types = pg.types;
types.setTypeParser(1114, function(stringValue: string) {
        return new Date(stringValue + "+0000");
});

const app  = express()
const port = 5000

app.use(express.json());

//Add logger
app.use(logger)

//Load routes
const ROUTES = `${__dirname}/1/`
fs.readdirSync(ROUTES)
.filter((file: any) => path.extname(file) === '.js')
.forEach((file: string) => {
    const filepath = ROUTES + file;
    const route    = file.replace(path.extname(file),'');
    import(filepath)
    .then(a => {
        //app.use(`/api/1/${route}`, authenticateToken, a.default)
        app.use(`/api/1/${route}`, a.default)
    });
})

//Setup
app.get('/api/setup', async (_, res) => {
    const [setup] = await knex('__flags__').where({key: 'setup'});
    res.status(200).send({setup: setup.value})
})

//Accounts
app.post('/api/signup', async (req, res, next) => {
    try {
        if ( !req.body.firstname || 
             !req.body.lastname  ||
             !req.body.email     ||
             !req.body.password
           ) throw new Error('Missing required fields');
        const { firstname, lastname, email, password } = req.body as User;
        await Auth.createUser(firstname, lastname, email, password);
        //XXX set token
        const user = await Auth.login(email, password); 
        res.status(200).send({user});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
})
app.post('/api/login', async (req, res, next) => {
    try {
        if ( !req.body.email || !req.body.password ) throw new Error('Missing required fields');
        const { email, password } = req.body as { email: string, password: string };
        const user                = await Auth.login(email, password);
        //XXX set token
        res.status(200).send({user});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
})

//Health check
app.get('/health', (_, res) => {
    res.status(200).send()
})

//Start
app.listen(port, () => console.log(`Running on port ${port}`))
