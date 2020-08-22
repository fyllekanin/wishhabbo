import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_STAFF_PERMISSION_MIDDLEWARE } from '../../middlewares/staff-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { PaginationHelper } from '../../../helpers/pagination.helper';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { GroupRepository } from '../../../persistance/repositories/group.repository';
import { ArticlePayload } from '../../../rest-service-views/payloads/staff/media/article.payload';
import { ValidationValidators } from '../../../validation/validation.validators';
import { ArticleEntity } from '../../../persistance/entities/staff/media/article.entity';
import { InternalRequest } from '../../../utilities/internal.request';
import { PaginationView } from '../../../rest-service-views/respond-views/pagination.view';
import { ArticleView } from '../../../rest-service-views/respond-views/staff/media/article.view';
import { Logger } from '../../../logging/log.logger';
import { LogTypes } from '../../../logging/log.types';

@Controller('api/staff/article')
export class ArticleController {

    @Get('page/:page')
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([
        Permissions.STAFF.CAN_WRITE_ARTICLES,
        Permissions.STAFF.CAN_MANAGE_ARTICLES
    ]) ])
    private async getArticles (req: InternalRequest, res: Response): Promise<void> {
        const data = await req.serviceConfig.articleRepository.paginate({
            take: PaginationHelper.TWENTY_ITEMS,
            page: Number(req.params.page),
            orderBy: {
                sort: 'articleId',
                order: 'DESC'
            }
        });

        const items = [];
        for (const item of data.getItems()) {
            items.push(ArticleView.newBuilder()
                .withArticleId(item.articleId)
                .withUser(await req.serviceConfig.userRepository.getSlimUserById(item.userId))
                .withTitle(item.title)
                .withContent(item.content)
                .withBadges(JSON.parse(item.badges))
                .withRoom(item.room)
                .withDifficulty(item.difficulty)
                .withType(item.type)
                .withIsApproved(item.isApproved)
                .build());
        }

        res.status(OK).json(PaginationView.newBuilder<ArticleView>()
            .withTotal(data.getTotal())
            .withPage(data.getPage())
            .withItems(items)
            .build());
    }

    @Get(':articleId')
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([
        Permissions.STAFF.CAN_WRITE_ARTICLES,
        Permissions.STAFF.CAN_MANAGE_ARTICLES
    ]) ])
    private async getArticle (req: InternalRequest, res: Response): Promise<void> {
        if (req.params.articleId === 'new') {
            res.status(OK).json();
            return;
        }

        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        if (!article) {
            res.status(NOT_FOUND).json();
            return;
        }

        res.status(OK).json(ArticleView.newBuilder()
            .withArticleId(article.articleId)
            .withTitle(article.title)
            .withContent(article.content)
            .withBadges(JSON.parse(article.badges))
            .withRoom(article.room)
            .withDifficulty(article.difficulty)
            .withType(article.type)
            .withIsApproved(article.isApproved)
            .build());
    }

    @Post()
    @Middleware([ AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([
        Permissions.STAFF.CAN_WRITE_ARTICLES,
        Permissions.STAFF.CAN_MANAGE_ARTICLES
    ]) ])
    private async createArticle (req: InternalRequest, res: Response): Promise<void> {
        const payload = ArticlePayload.of(JSON.parse(req.fields.article as string), req.files.thumbnail);
        const payloadErrors = await ValidationValidators.validatePayload(payload, req.serviceConfig);
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
        const entityErrors = await ValidationValidators.validateEntity(article, req.serviceConfig);
        if (entityErrors.length > 0) {
            res.status(BAD_REQUEST).json(entityErrors);
            return;
        }

        await req.serviceConfig.articleRepository.save(article).catch(reason => {
            throw reason;
        });
        const result = await req.serviceConfig.resourceRepository.uploadArticleThumbnail(req, `${article.articleId}`);
        if (!result) {
            await req.serviceConfig.articleRepository.delete(article);
            res.status(BAD_REQUEST).json();
            return;
        }

        await Logger.createStaffLog(req, {
            id: LogTypes.CREATED_ARTICLE,
            contentId: article.articleId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: JSON.stringify(article)
        });

        res.status(OK).json(article.articleId);
    }

    @Post(':articleId')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES ])
    ])
    private async updateArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        const payload = ArticlePayload.of(JSON.parse(req.fields.article as string), req.files.thumbnail);
        const payloadErrors = await ValidationValidators.validatePayload(payload, req.serviceConfig);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        const articleCopy = { ...article };
        article.title = payload.getTitle();
        article.content = payload.getContent();
        article.badges = JSON.stringify(payload.getBadges());
        article.room = payload.getRoom();
        article.difficulty = payload.getDifficulty();

        const entityErrors = await ValidationValidators.validateEntity(article, req.serviceConfig);
        if (entityErrors.length > 0) {
            res.status(BAD_REQUEST).json(entityErrors);
            return;
        }

        let status = OK;
        let response = '';
        await req.serviceConfig.articleRepository.save(article).catch(reason => {
            status = INTERNAL_SERVER_ERROR;
            response = reason;
        });
        if (payload.getFile()) {
            const result = await req.serviceConfig.resourceRepository.uploadArticleThumbnail(req, `${article.articleId}`);
            if (!result) {
                res.status(BAD_REQUEST).json();
                return;
            }
        }

        await Logger.createStaffLog(req, {
            id: LogTypes.UPDATED_ARTICLE,
            contentId: article.articleId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(articleCopy),
            afterChange: JSON.stringify(article)
        });

        res.status(status).json(response);
    }

    @Delete(':articleId')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES ])
    ])
    private async deleteArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        await req.serviceConfig.articleRepository.delete(article);
        await req.serviceConfig.resourceRepository.removeArticleThumbnail(Number(req.params.articleId));

        await Logger.createStaffLog(req, {
            id: LogTypes.DELETED_ARTICLE,
            contentId: article.articleId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(article),
            afterChange: null
        });

        res.status(OK).json();
    }

    @Put(':articleId/approve')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES ])
    ])
    private async approveArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        article.isApproved = true;
        await req.serviceConfig.articleRepository.save(article);
        await Logger.createStaffLog(req, {
            id: LogTypes.APPROVED_ARTICLE,
            contentId: article.articleId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: null
        });
        res.status(OK).json();
    }

    @Put(':articleId/unapprove')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES ])
    ])
    private async unapproveArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        article.isApproved = false;
        await req.serviceConfig.articleRepository.save(article);
        await Logger.createStaffLog(req, {
            id: LogTypes.UNAPPROVED_ARTICLE,
            contentId: article.articleId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: null
        });
        res.status(OK).json();
    }

    private async canRequesterManageArticles ({ user }: InternalRequest): Promise<boolean> {
        const groupRepository = new GroupRepository();
        return await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_MANAGE_ARTICLES);
    }
}
