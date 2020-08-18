import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { AuthenticationController } from './rest-services/auth/authentication.controller';
import { PageController } from './rest-services/page.controller';
import { BackgroundTaskHandler } from './background-tasks/background-task.handler';
import { StaffController } from './rest-services/staff/staff.controller';
import { SET_USER_MIDDLEWARE } from './rest-services/middlewares/set-user.middleware';
import { ArticleController } from './rest-services/staff/media/article.controller';

class MainServer extends Server {
    private backgroundTaskHandler: BackgroundTaskHandler;

    constructor () {
        super();
        this.backgroundTaskHandler = new BackgroundTaskHandler();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    start (port: number): void {
        createConnection().then(() => {
            this.setupControllers();
            this.backgroundTaskHandler.activate();
            this.app.listen(port, () => {
                console.log(`Server started on port ${port}`);
            });
        });
    }

    private setupControllers (): void {
        super.addControllers(
            [
                new AuthenticationController(),
                new PageController(),
                new StaffController(),
                new ArticleController()
            ],
            null,
            SET_USER_MIDDLEWARE
        );
    }
}

const server = new MainServer();
server.start(3000);
