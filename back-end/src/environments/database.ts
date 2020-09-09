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
        'src/persistance/entities/**/*.ts'
    ],
    migrationsTableName: 'migrations',
    migrations: [
        'src/database/migrations/**/*.ts',
        'src/database/seeds/**/*.ts'
    ],
    subscribers: [
        'src/persistance/subscribers/**/*.ts'
    ],
    cli: {
        entitiesDir: 'src/persistance/entities',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'src/persistance/subscriber'
    }
};
