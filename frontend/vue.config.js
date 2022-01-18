module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5000',
                changeOrigin: false,
                pathRewrite: {}
            }
        },
        host: '0.0.0.0'
    }
}
