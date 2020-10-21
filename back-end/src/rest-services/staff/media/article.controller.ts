import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_STAFF_PERMISSION_MIDDLEWARE } from '../../middlewares/staff-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { PaginationHelper } from '../../../helpers/pagination.helper';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { ArticlePayload } from '../../../rest-service-views/payloads/staff/media/article.payload';
import { ValidationValidators } from '../../../validation/validation.validators';
import { ArticleEntity } from '../../../persistance/entities/staff/media/article.entity';
import { InternalRequest } from '../../../utilities/internal.request';
import { PaginationView } from '../../../rest-service-views/respond-views/pagination.view';
import { ArticleView } from '../../../rest-service-views/respond-views/staff/media/article.view';
import { Logger } from '../../../logging/log.logger';
import { LogTypes } from '../../../logging/log.types';
import ExpressFormidable from 'express-formidable';
import { UserGroupOrchestrator } from '../../../persistance/repositories/group/user-group.orchestrator';
import { PaginationValue, RequestUtility } from '../../../utilities/request.utility';

@Controller('api/staff/articles')
export class ArticleController {
    private static readonly SEARCHABLE_VALUES: Array<PaginationValue> = [
        { key: 'title', operator: 'LIKE' },
        { key: 'type', operator: '=' },
        { key: 'isApproved', operator: '=' }
    ];

    @Get('page/:page')
    @Middleware([AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([
        Permissions.STAFF.CAN_WRITE_ARTICLES,
        Permissions.STAFF.CAN_MANAGE_ARTICLES
    ])])
    async getArticles (req: InternalRequest, res: Response): Promise<void> {
        const data = await req.serviceConfig.articleRepository.paginate({
            take: PaginationHelper.TWENTY_ITEMS,
            page: Number(req.params.page),
            where: RequestUtility.getPaginationWheresFromQuery(req, ArticleController.SEARCHABLE_VALUES),
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
                .withBadges((item.badges || '').split(','))
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
    @Middleware([AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([
        Permissions.STAFF.CAN_WRITE_ARTICLES,
        Permissions.STAFF.CAN_MANAGE_ARTICLES
    ])])
    async getArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        if (!article) {
            res.status(NOT_FOUND).json();
            return;
        }

        res.status(OK).json(ArticleView.newBuilder()
            .withArticleId(article.articleId)
            .withTitle(article.title)
            .withContent(article.content)
            .withBadges((article.badges || '').split(','))
            .withRoom(article.room)
            .withRoomOwner(article.roomOwner)
            .withDifficulty(article.difficulty)
            .withType(article.type)
            .withIsApproved(article.isApproved)
            .withIsAvailable(article.isAvailable)
            .withIsPaid(article.isPaid)
            .build());
    }

    @Post()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_STAFF_PERMISSION_MIDDLEWARE([
            Permissions.STAFF.CAN_WRITE_ARTICLES,
            Permissions.STAFF.CAN_MANAGE_ARTICLES
        ]),
        ExpressFormidable({
            multiples: true
        })
    ])
    async createArticle (req: InternalRequest, res: Response): Promise<void> {
        const payload = ArticlePayload.of(JSON.parse(req.fields.article as string), req.files.thumbnail, null);
        const payloadErrors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);
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
            .withRoomOwner(payload.getRoomOwner())
            .withDifficulty(payload.getDifficulty())
            .withIsAvailable(payload.getIsAvailable())
            .withIsPaid(payload.getIsPaid())
            .build();
        const entityErrors = await ValidationValidators.validateEntity(article, req.serviceConfig, req.user);
        if (entityErrors.length > 0) {
            res.status(BAD_REQUEST).json(entityErrors);
            return;
        }

        const updatedEntity = await req.serviceConfig.articleRepository.create(article).catch(reason => {
            throw reason;
        });
        const result = await req.serviceConfig.resourceRepository.uploadArticleThumbnail(req, `${updatedEntity.articleId}`);
        if (!result) {
            await req.serviceConfig.articleRepository.delete(updatedEntity);
            res.status(BAD_REQUEST).json();
            return;
        }

        await Logger.createStaffLog(req, {
            id: LogTypes.CREATED_ARTICLE,
            contentId: updatedEntity.articleId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: JSON.stringify(updatedEntity)
        });

        res.status(OK).json(updatedEntity.articleId);
    }

    @Post(':articleId')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES]),
        ExpressFormidable({
            multiples: true
        })
    ])
    async updateArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || (article.userId !== req.user.userId && !canManageArticle)) {
            res.status(NOT_FOUND).json();
            return;
        }

        const payload = ArticlePayload.of(JSON.parse(req.fields.article as string), req.files.thumbnail, article.articleId);
        const payloadErrors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        const updatedArticle = article.newBuilderFromCurrent()
            .withTitle(payload.getTitle())
            .withContent(payload.getContent())
            .withBadges(payload.getBadges())
            .withRoom(payload.getRoom())
            .withType(payload.getType())
            .withRoomOwner(payload.getRoomOwner())
            .withDifficulty(payload.getDifficulty())
            .withIsAvailable(payload.getIsAvailable())
            .withIsPaid(payload.getIsPaid())
            .build();

        const entityErrors = await ValidationValidators.validateEntity(updatedArticle, req.serviceConfig, req.user);
        if (entityErrors.length > 0) {
            res.status(BAD_REQUEST).json(entityErrors);
            return;
        }

        await req.serviceConfig.articleRepository.update(updatedArticle).catch(err => {
            res.status(BAD_REQUEST).json();
            throw err;
        });

        if (payload.getFile()) {
            const result = await req.serviceConfig.resourceRepository.uploadArticleThumbnail(req, `${updatedArticle.articleId}`);
            if (!result) {
                res.status(BAD_REQUEST).json();
                return;
            }
        }

        await Logger.createStaffLog(req, {
            id: LogTypes.UPDATED_ARTICLE,
            contentId: updatedArticle.articleId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(article),
            afterChange: JSON.stringify(updatedArticle)
        });

        res.status(OK).json();
    }

    @Delete(':articleId')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES])
    ])
    async deleteArticle (req: InternalRequest, res: Response): Promise<void> {
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
        GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES])
    ])
    async approveArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || !canManageArticle) {
            res.status(NOT_FOUND).json();
            return;
        }

        const updatedArticle = article.newBuilderFromCurrent()
            .withIsApproved(true)
            .build();
        await req.serviceConfig.articleRepository.save(updatedArticle);
        await Logger.createStaffLog(req, {
            id: LogTypes.APPROVED_ARTICLE,
            contentId: updatedArticle.articleId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: null
        });
        res.status(OK).json();
    }

    @Put(':articleId/unapprove')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_WRITE_ARTICLES, Permissions.STAFF.CAN_MANAGE_ARTICLES])
    ])
    async unapproveArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        const canManageArticle = await this.canRequesterManageArticles(req);

        if (!article || !canManageArticle) {
            res.status(NOT_FOUND).json();
            return;
        }

        const updatedArticle = article.newBuilderFromCurrent()
            .withIsApproved(false)
            .build();
        await req.serviceConfig.articleRepository.save(updatedArticle);
        await Logger.createStaffLog(req, {
            id: LogTypes.UNAPPROVED_ARTICLE,
            contentId: updatedArticle.articleId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: null
        });
        res.status(OK).json();
    }

    private async canRequesterManageArticles (req: InternalRequest): Promise<boolean> {
        return UserGroupOrchestrator.doUserHaveStaffPermission(
            req.serviceConfig,
            req.user.userId,
            Permissions.STAFF.CAN_MANAGE_ARTICLES);
    }
}
