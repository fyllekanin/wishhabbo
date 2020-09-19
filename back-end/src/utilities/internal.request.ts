import { Request } from 'express';
import { ResourceRepository } from '../persistance/repositories/resource.repository';
import { HabboRepository } from '../persistance/repositories/habbo.repository';
import { GroupRepository } from '../persistance/repositories/group.repository';
import { TokenRepository } from '../persistance/repositories/user/token.repository';
import { ArticleRepository } from '../persistance/repositories/staff/media/article.repository';
import { UserRepository } from '../persistance/repositories/user/user.repository';
import { TimetableRepository } from '../persistance/repositories/staff/timetable.repository';
import { EventsRepository } from '../persistance/repositories/staff/events.repository';
import { TokenEntity } from '../persistance/entities/user/token.entity';
import { SettingRepository } from '../persistance/repositories/setting.repository';
import { BbcodeRepository } from '../persistance/repositories/bbcode.repository';

export interface ServiceConfig {
    resourceRepository: ResourceRepository;
    habboRepository: HabboRepository;
    groupRepository: GroupRepository;
    userRepository: UserRepository;
    tokenRepository: TokenRepository;
    articleRepository: ArticleRepository;
    timetableRepository: TimetableRepository;
    eventsRepository: EventsRepository;
    settingRepository: SettingRepository;
    bbcodeRepository: BbcodeRepository
}

export interface InternalUser {
    userId: number;
    tokenEntity: TokenEntity;
}

export interface InternalRequest extends Request {
    user: InternalUser;
    serviceConfig: ServiceConfig;
}
