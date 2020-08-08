import { DeleteResult, getConnection, LessThan, Repository } from 'typeorm';
import { TokenEntity } from '../../entities/user/token.entity';
import { UserEntity } from '../../entities/user/user.entity';
import { IdHelper } from '../../../helpers/id.helper';
import { TimeUtility } from '../../../utilities/time.utility';
import { Request } from 'express';
import { RequestUtility } from '../../../utilities/request.utility';
import { HasherUtility } from '../../../utilities/hasher.utility';

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
        return await this.getTokenWithAccessToken(accessToken);
    }

    async getTokenWithAccessToken (accessToken: string): Promise<TokenEntity> {
        return await this.repository.findOne({
            access: accessToken
        });
    }

    async getTokenWithAccessAndRefreshToken (req: Request): Promise<TokenEntity> {
        return await this.repository.findOne({
            refresh: RequestUtility.getRefreshToken(req),
            access: RequestUtility.getAccessToken(req)
        });
    }

    isAccessTokenAlive (entity: TokenEntity): boolean {
        return Boolean(entity && (entity.updatedAt + TokenRepository.ACCESS_TOKEN_LIFE_TIME) > TimeUtility.getCurrent());
    }

    isRefreshTokenAlive (entity: TokenEntity): boolean {
        return Boolean(entity && (entity.updatedAt + TokenRepository.REFRESH_TOKEN_LIFE_TIME) > TimeUtility.getCurrent());
    }

    async getTokens (): Promise<Array<TokenEntity>> {
        return await this.repository.find();
    }

    async deleteExpiredTokens (): Promise<DeleteResult> {
        return await this.repository.delete({ updatedAt: LessThan(TimeUtility.getCurrent() - TokenRepository.REFRESH_TOKEN_LIFE_TIME) });
    }

    async getToken (user: UserEntity): Promise<TokenEntity> {
        const entity = new TokenEntity();
        entity.userId = user.userId;
        entity.access = await this.getAvailableAccessToken();
        entity.refresh = await this.getAvailableRefreshToken();

        await this.repository.save(entity);
        return entity;
    }

    private async getAvailableAccessToken (): Promise<string> {
        const newToken = await HasherUtility.hash(IdHelper.newUuid());
        const isAvailable = await this.repository.count({ access: newToken }) === 0;
        return isAvailable ? newToken : await this.getAvailableAccessToken();
    }

    private async getAvailableRefreshToken (): Promise<string> {
        const newToken = await HasherUtility.hash(IdHelper.newUuid());
        const isAvailable = await this.repository.count({ refresh: newToken }) === 0;
        return isAvailable ? newToken : await this.getAvailableAccessToken();
    }
}
