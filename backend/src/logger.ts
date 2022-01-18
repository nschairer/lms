import pino from 'pino-http'
export default pino({
    level: 'info',
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url
        })
    }
})

