import { Request } from 'express';
import { ResourceRepository } from '../persistance/repositories/resource.repository';
import { HabboRepository } from '../persistance/repositories/habbo.repository';
import { GroupRepository } from '../persistance/repositories/group.repository';
import { TokenRepository } from '../persistance/repositories/user/token.repository';
import { ArticleRepository } from '../persistance/repositories/staff/media/article.repository';
import { UserRepository } from '../persistance/repositories/user/user.repository';
import { LogRepository } from '../persistance/repositories/log.repository';
import { TimetableRepository } from '../persistance/repositories/staff/timetable.repository';
import { EventsRepository } from '../persistance/repositories/staff/events.repository';
import { TokenEntity } from '../persistance/entities/user/token.entity';

export interface ServiceConfig {
    resourceRepository: ResourceRepository;
    habboRepository: HabboRepository;
    groupRepository: GroupRepository;
    userRepository: UserRepository;
    tokenRepository: TokenRepository;
    articleRepository: ArticleRepository;
    logRepository: LogRepository;
    timetableRepository: TimetableRepository;
    eventsRepository: EventsRepository;
}

export interface InternalUser {
    userId: number;
    tokenEntity: TokenEntity;
}

export interface InternalRequest extends Request {
    user: InternalUser;
    serviceConfig: ServiceConfig;
}
