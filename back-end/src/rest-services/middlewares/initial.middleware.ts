import { NextFunction, Response } from 'express';
import { TokenRepository } from '../../persistance/repositories/user/token.repository';
import { InternalRequest, ServiceConfig } from '../../utilities/internal.request';
import { UserRepository } from '../../persistance/repositories/user/user.repository';
import { ResourceRepository } from '../../persistance/repositories/resource.repository';
import { HabboRepository } from '../../persistance/repositories/habbo.repository';
import { GroupRepository } from '../../persistance/repositories/group.repository';
import { ArticleRepository } from '../../persistance/repositories/staff/media/article.repository';
import { LogRepository } from '../../persistance/repositories/log.repository';
import { TimetableRepository } from '../../persistance/repositories/staff/timetable.repository';
import { EventsRepository } from '../../persistance/repositories/staff/events.repository';

function getServiceConfig (): ServiceConfig {
    return {
        resourceRepository: new ResourceRepository(),
        habboRepository: new HabboRepository(),
        groupRepository: new GroupRepository(),
        userRepository: new UserRepository(),
        tokenRepository: new TokenRepository(),
        articleRepository: new ArticleRepository(),
        logRepository: new LogRepository(),
        timetableRepository: new TimetableRepository(),
        eventsRepository: new EventsRepository()
    };
}

export const INITIAL_MIDDLEWARE = async (req: InternalRequest, res: Response, next: NextFunction) => {
    req.serviceConfig = getServiceConfig();
    const entity = await req.serviceConfig.tokenRepository.getTokenFromRequest(req);

    if (!entity) {
        next();
        return;
    }
    if (!req.serviceConfig.tokenRepository.isAccessTokenAlive(entity)) {
        req.user = {
            userId: 0,
            tokenEntity: entity
        };
        next();
        return;
    }
    req.user = {
        userId: entity.userId,
        tokenEntity: entity
    };
    next();
};
