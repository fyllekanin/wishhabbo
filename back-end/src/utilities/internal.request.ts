import { Request } from 'express';
import { UserEntity } from '../persistance/entities/user/user.entity';
import { ResourceRepository } from '../persistance/repositories/resource.repository';
import { HabboRepository } from '../persistance/repositories/habbo.repository';
import { GroupRepository } from '../persistance/repositories/group.repository';
import { TokenRepository } from '../persistance/repositories/user/token.repository';
import { ArticleRepository } from '../persistance/repositories/staff/media/article.repository';
import { UserRepository } from '../persistance/repositories/user/user.repository';
import { LogRepository } from '../persistance/repositories/log.repository';

export interface ServiceConfig {
    resourceRepository: ResourceRepository;
    habboRepository: HabboRepository;
    groupRepository: GroupRepository;
    userRepository: UserRepository;
    tokenRepository: TokenRepository;
    articleRepository: ArticleRepository;
    logRepository: LogRepository;
}

export interface InternalRequest extends Request {
    user: UserEntity;
    serviceConfig: ServiceConfig;
}
