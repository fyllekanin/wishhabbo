import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';
import { Server } from '@overnightjs/core';
import { AuthenticationController } from './rest-services/auth/authentication.controller';
import { PageController } from './rest-services/page.controller';
import { BackgroundTaskHandler } from './background-tasks/background-task.handler';
import { StaffController } from './rest-services/staff/staff.controller';
import { INITIAL_MIDDLEWARE } from './rest-services/middlewares/initial.middleware';
import { ArticleController } from './rest-services/staff/media/article.controller';
import { RadioController } from './rest-services/staff/radio.controller';
import { EventsController } from './rest-services/staff/events.controller';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { GroupController } from './rest-services/admin/users/group.controller';
import { UserController } from './rest-services/admin/users/user.controller';
import compression from 'compression';
import Database from './environments/database';
import { StaffListController } from './rest-services/admin/website-settings/staff-list.controller';
import { RadioSettingsController } from './rest-services/admin/website-settings/radio-settings.controller';
import { InformationController } from './rest-services/information.controller';
import { BbcodeController } from './rest-services/admin/website-settings/bbcode.controller';
import { AdminController } from './rest-services/admin/admin.controller';
import { AccountController } from './rest-services/user/account.controller';
import { HomePageSettingsController } from './rest-services/admin/website-settings/home-page-settings.controller';
import { ArticleCommentController } from './rest-services/article-comment.controller';

class MainServer extends Server {
    private backgroundTaskHandler: BackgroundTaskHandler;

    constructor () {
        super();
        this.backgroundTaskHandler = new BackgroundTaskHandler();
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(compression());
        this.app.use('/', express.static(__dirname + '/public'));
        this.app.use('/resources', express.static(__dirname + '/resources'));
    }

    start (port: number): void {
        createConnection(Database as ConnectionOptions).then(() => {
            this.setupControllers();
            this.backgroundTaskHandler.activate();
            this.app.get('/*', (req, res) => {
                res.sendFile(__dirname + '/public/index.html');
            });
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
                new EventsController(),
                new GroupController(),
                new UserController(),
                new StaffListController(),
                new RadioSettingsController(),
                new InformationController(),
                new BbcodeController(),
                new AdminController(),
                new AccountController(),
                new HomePageSettingsController(),
                new ArticleCommentController()
            ],
            null,
            INITIAL_MIDDLEWARE
        );
    }
}

const server = new MainServer();
server.start(3000);
