import { DeleteResult, getConnection, LessThan, Not, Repository } from 'typeorm';
import { TokenEntity } from '../../entities/user/token.entity';
import { UserEntity } from '../../entities/user/user.entity';
import { IdHelper } from '../../../helpers/id.helper';
import { TimeUtility } from '../../../utilities/time.utility';
import { RequestUtility } from '../../../utilities/request.utility';
import { InternalRequest } from '../../../utilities/internal.request';

export class TokenRepository {
    private static readonly ACCESS_TOKEN_LIFE_TIME = 7200;
    private static readonly REFRESH_TOKEN_LIFE_TIME = 86400;
    repository: Repository<TokenEntity>;

    async save (entity: TokenEntity): Promise<TokenEntity> {
        return await this.getRepository().save(entity);
    }

    async delete (entity: TokenEntity): Promise<DeleteResult> {
        return await this.getRepository().delete({ tokenId: entity.tokenId });
    }

    async deleteTokensForUserIdExcept (userId: number, except: string): Promise<void> {
        await this.getRepository().delete({
            userId: userId,
            tokenId: Not(except)
        });
    }

    async getTokenFromRequest (req: InternalRequest): Promise<TokenEntity> {
        const accessToken = RequestUtility.getAccessToken(req);
        const token = await this.getTokenWithAccessToken(accessToken);
        if (!this.isAccessTokenAlive(token) && this.isRefreshTokenAlive(token)) {
            token.access = await this.getAvailableAccessToken();
            token.refresh = await this.getAvailableRefreshToken();
            await this.getRepository().save(token);
        }
        return token;
    }

    async getUserIdFromRequest (req: InternalRequest): Promise<number> {
        const token = await this.getTokenFromRequest(req);
        return token.userId;
    }

    async getTokenWithAccessToken (accessToken: string): Promise<TokenEntity> {
        return await this.getRepository().findOne({
            access: accessToken
        });
    }

    async getTokenWithAccessAndRefreshToken (req: InternalRequest): Promise<TokenEntity> {
        return await this.getRepository().findOne({
            refresh: RequestUtility.getRefreshToken(req),
            access: RequestUtility.getAccessToken(req)
        });
    }

    isAccessTokenAlive (entity: TokenEntity): boolean {
        return Boolean(entity && (entity.updatedAt + TokenRepository.ACCESS_TOKEN_LIFE_TIME) > TimeUtility.getCurrentTime());
    }

    isRefreshTokenAlive (entity: TokenEntity): boolean {
        return Boolean(entity && (entity.updatedAt + TokenRepository.REFRESH_TOKEN_LIFE_TIME) > TimeUtility.getCurrentTime());
    }

    async getTokens (): Promise<Array<TokenEntity>> {
        return await this.getRepository().find();
    }

    async deleteExpiredTokens (): Promise<DeleteResult> {
        return await this.getRepository()
            .delete({ updatedAt: LessThan(TimeUtility.getCurrentTime() - TokenRepository.REFRESH_TOKEN_LIFE_TIME) });
    }

    async getToken (user: UserEntity): Promise<TokenEntity> {
        const entity = TokenEntity.newBuilder()
            .withUserId(user.userId)
            .withAccess(await this.getAvailableAccessToken())
            .withRefresh(await this.getAvailableRefreshToken())
            .build();

        await this.getRepository().save(entity);
        return entity;
    }

    private async getAvailableAccessToken (): Promise<string> {
        const newToken = IdHelper.newUuid();
        const isAvailable = await this.getRepository().count({ access: newToken }) === 0;
        return isAvailable ? newToken : await this.getAvailableAccessToken();
    }

    private async getAvailableRefreshToken (): Promise<string> {
        const newToken = IdHelper.newUuid();
        const isAvailable = await this.getRepository().count({ refresh: newToken }) === 0;
        return isAvailable ? newToken : await this.getAvailableRefreshToken();
    }

    private getRepository (): Repository<TokenEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(TokenEntity);
        return this.repository;
    }
}
