import { DeleteResult, getConnection, Repository } from 'typeorm';
import { TokenEntity } from '../../entities/user/token.entity';
import { UserEntity } from '../../entities/user/user.entity';
import { IdHelper } from '../../../helpers/id.helper';
import { TimeUtility } from '../../../utilities/time.utility';
import { Request } from 'express';
import { RequestUtility } from '../../../utilities/request.utility';

export class TokenRepository {
    private static readonly ACCESS_TOKEN_LIFE_TIME = 7200;
    private static readonly REFRESH_TOKEN_LIFE_TIME = 86400;
    repository: Repository<TokenEntity>;

    constructor () {
        this.repository = getConnection().getRepository(TokenEntity);
    }

    async save (entity: TokenEntity): Promise<TokenEntity> {
        return await this.repository.save(entity);
    }

    async delete (entity: TokenEntity): Promise<DeleteResult> {
        return await this.repository.delete({ tokenId: entity.tokenId });
    }

    async getTokenFromRequest (req: Request): Promise<TokenEntity> {
        const accessToken = RequestUtility.getAccessToken(req);
        const entity = await this.getTokenWithIP(req.ip, accessToken);

        return this.isTokenAlive(entity) ? entity : null;
    }

    async getTokenWithIP (ip: string, accessToken: string): Promise<TokenEntity> {
        return await this.repository.findOne({
            ip: ip,
            access: accessToken
        });
    }

    async getTokenWithIPAndRefreshToken (ip: string, refreshToken: string): Promise<TokenEntity> {
        return await this.repository.findOne({
            ip: ip,
            refresh: refreshToken
        });
    }

    isAccessTokenAlive (entity: TokenEntity): boolean {
        return Boolean(entity && (entity.updatedAt + TokenRepository.ACCESS_TOKEN_LIFE_TIME) > TimeUtility.getCurrent());
    }

    isRefreshTokenAlive (entity: TokenEntity): boolean {
        return Boolean(entity && (entity.updatedAt + TokenRepository.REFRESH_TOKEN_LIFE_TIME) > TimeUtility.getCurrent());
    }

    async getToken (user: UserEntity, ip: string): Promise<TokenEntity> {
        let entity: TokenEntity;
        const existing = await this.getExistingByIPForUser(user.userId, ip);
        if (existing) {
            entity = existing;
        } else {
            entity = new TokenEntity();
        }
        entity.userId = user.userId;
        entity.access = existing && this.isTokenAlive(existing) ? existing.access : IdHelper.newUuid();
        entity.refresh = existing && this.isTokenAlive(existing) ? existing.refresh : IdHelper.newUuid();
        entity.ip = ip;

        await this.repository.save(entity);
        return entity;
    }

    private async getExistingByIPForUser (userId: number, ip: string): Promise<TokenEntity> {
        return await this.repository.findOne({
            userId: userId,
            ip: ip
        });
    }

    private isTokenAlive (entity: TokenEntity): boolean {
        return (entity.updatedAt + TokenRepository.ACCESS_TOKEN_LIFE_TIME) > TimeUtility.getCurrent();
    }
}
