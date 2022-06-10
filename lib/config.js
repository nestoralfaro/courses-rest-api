module.exports = {
    hostPort: 8000,
    logLevel: 'dev',
    sessionOptions: {
        secret: 'secret',
        saveUninitialized: false,
        resave: false
    },
    db: {
        host: 'localhost',
        database: 'comp4310',
    }
};