import 'module-alias/register';

import fs      from 'fs';
import path    from 'path';
import express from 'express';
import logger  from '@/logger';
import config  from '@/config';
import { authenticateToken } from '@/core/auth';

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

//Health check
app.get('/health', (_, res) => {
    res.status(200).send()
})

//Start
app.listen(port, () => console.log(`Running on port ${port}`))
