export = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'wishhabbo',
    synchronize: false,
    logging: false,
    name: 'default',
    entities: [
        'dist/persistance/entities/**/*.js'
    ],
    migrationsTableName: 'migrations',
    migrations: [
        'dist/database/migrations/**/*.js',
        'dist/database/seeds/**/*.js'
    ],
    subscribers: [
        'dist/persistance/subscribers/**/*.js'
    ],
    cli: {
        entitiesDir: 'dist/persistance/entities',
        migrationsDir: 'dist/database/migrations',
        subscribersDir: 'dist/persistance/subscriber'
    }
};
