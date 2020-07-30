import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { AuthenticationController } from './rest-services/auth/authentication.controller';
import { PageController } from './rest-services/page.controller';

class MainServer extends Server {

    constructor () {
        super();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    start (port: number): void {
        createConnection().then(() => {
            this.setupControllers();
            this.app.listen(port, () => {
                console.log(`Server started on port ${port}`);
            });
        });
    }

    private setupControllers (): void {
        super.addControllers(
            [
                new AuthenticationController(),
                new PageController()
            ]
        );
    }
}

const server = new MainServer();
server.start(3000);
