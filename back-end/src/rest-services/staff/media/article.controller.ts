import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_STAFF_PERMISSION_MIDDLEWARE } from '../../middlewares/staff-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { ArticleRepository } from '../../../persistance/repositories/staff/media/article.repository';
import { PaginationHelper } from '../../../helpers/pagination.helper';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { GroupRepository } from '../../../persistance/repositories/group.repository';
import { ArticlePayload } from '../../../rest-service-views/payloads/staff/media/article.payload';
import { ValidationValidators } from '../../../validation/validation.validators';
import { ArticleEntity } from '../../../persistance/entities/staff/media/article.entity';
import { InternalRequest } from '../../../utilities/internal.request';

@Controller('api/staff/article')
export class ArticleController {

    @Get('list/:page')
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES ]) ])
    private async getArticles (req: InternalRequest, res: Response): Promise<void> {
        const articleRepository = new ArticleRepository();

        res.status(OK).json(await articleRepository.paginate({
            take: PaginationHelper.TWENTY_ITEMS,
            page: Number(req.params.page),
            orderBy: {
                sort: 'createdAt',
                order: 'DESC'
            }
        }));
    }

    @Post()
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES ]) ])
    private async createArticle (req: InternalRequest, res: Response): Promise<void> {
        const articleRepository = new ArticleRepository();
        const payload = ArticlePayload.of(req);
        const payloadErrors = await ValidationValidators.validatePayload(payload);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        const article = ArticleEntity.newBuilder()
            .withUserId(req.user.userId)
            .withTitle(payload.getTitle())
            .withContent(payload.getContent())
            .withBadges(payload.getBadges())
            .withRoom(payload.getRoom())
            .withDifficulty(payload.getDifficulty())
            .build();
        const entityErrors = await ValidationValidators.validateEntity(article);
        if (entityErrors.length > 0) {
            res.status(BAD_REQUEST).json(entityErrors);
            return;
        }

        let status = OK;
        let response = '';
        await articleRepository.save(article).catch(reason => {
            status = INTERNAL_SERVER_ERROR;
            response = reason;
        });

        res.status(status).json(response);
    }

    @Post(':articleId')
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES ]) ])
    private async updateArticle (req: InternalRequest, res: Response): Promise<void> {
        const articleRepository = new ArticleRepository();
        const article = await articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        const payload = ArticlePayload.of(req);
        const payloadErrors = await ValidationValidators.validatePayload(payload);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        article.title = payload.getTitle();
        article.content = payload.getContent();
        article.badges = JSON.stringify(payload.getBadges());
        article.room = payload.getRoom();
        article.difficulty = payload.getDifficulty();

        const entityErrors = await ValidationValidators.validateEntity(article);
        if (entityErrors.length > 0) {
            res.status(BAD_REQUEST).json(entityErrors);
            return;
        }

        let status = OK;
        let response = '';
        await articleRepository.save(article).catch(reason => {
            status = INTERNAL_SERVER_ERROR;
            response = reason;
        });

        res.status(status).json(response);
    }

    @Delete(':articleId')
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES ]) ])
    private async deleteArticle (req: InternalRequest, res: Response): Promise<void> {
        const articleRepository = new ArticleRepository();
        const article = await articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        await articleRepository.delete(article);
        res.status(OK).json();
    }

    @Put(':articleId/approve')
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES ]) ])
    private async approveArticle (req: InternalRequest, res: Response): Promise<void> {
        const articleRepository = new ArticleRepository();
        const article = await articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        article.isApproved = true;
        await articleRepository.save(article);
        res.status(OK).json();
    }

    @Put(':articleId/unapprove')
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES ]) ])
    private async unapproveArticle (req: InternalRequest, res: Response): Promise<void> {
        const articleRepository = new ArticleRepository();
        const article = await articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        article.isApproved = false;
        await articleRepository.save(article);
        res.status(OK).json();
    }

    private async canRequesterManageArticles ({ user }: InternalRequest): Promise<boolean> {
        const groupRepository = new GroupRepository();
        return await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_MANAGE_ARTICLES);
    }
}
