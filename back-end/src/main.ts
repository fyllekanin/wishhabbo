import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Server } from '@overnightjs/core';
import { AuthenticationController } from './rest-services/auth/authentication.controller';
import { PageController } from './rest-services/page.controller';
import { BackgroundTaskHandler } from './background-tasks/background-task.handler';
import { StaffController } from './rest-services/staff/staff.controller';
import { INITIAL_MIDDLEWARE } from './rest-services/middlewares/initial.middleware';
import { ArticleController } from './rest-services/staff/media/article.controller';
import ExpressFormidable from 'express-formidable';
import { RadioController } from './rest-services/staff/radio.controller';
import { EventsController } from './rest-services/staff/events.controller';


class MainServer extends Server {
    private backgroundTaskHandler: BackgroundTaskHandler;

    constructor () {
        super();
        this.backgroundTaskHandler = new BackgroundTaskHandler();
        this.app.use(ExpressFormidable({
            multiples: true
        }));
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
                new ArticleController(),
                new RadioController(),
                new EventsController()
            ],
            null,
            INITIAL_MIDDLEWARE
        );
    }
}

const server = new MainServer();
server.start(3000);
