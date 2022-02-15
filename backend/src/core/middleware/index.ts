import Ajv      from 'ajv';

const ajv = new Ajv()

ajv.addFormat('date', {
    validate: (date: string) => new Date(date).toString() !== 'Invalid Date',
})

export const AJVValidate = ( { schema, key }: { schema: any, key: string } ) => {
    const compiled = ajv.compile(schema);
    return (req: any, res: any, next: any) => {
        let val;
        if ( key ) {
            val = req.body[key];
        } else {
            val = req.body;
        }
        if (!compiled(val)) {
            res.status(400).send(compiled.errors)
        }
        next()
    }
}
