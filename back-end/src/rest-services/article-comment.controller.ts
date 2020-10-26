import { Controller, Delete, Middleware, Post, Put } from '@overnightjs/core';
import { Permissions } from '../constants/permissions.constant';
import { InternalRequest } from '../utilities/internal.request';
import { UserGroupOrchestrator } from '../persistance/repositories/group/user-group.orchestrator';
import { Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from './middlewares/authorization.middleware';
import { ArticleCommentEntity } from '../persistance/entities/staff/media/article-comment.entity';
import { Logger } from '../logging/log.logger';
import { LogTypes } from '../logging/log.types';
import { GET_STAFF_PERMISSION_MIDDLEWARE } from './middlewares/staff-permission.middleware';
import { PaginationWhereOperators } from '../persistance/repositories/base.repository';
import { ValidationError } from '../validation/validation.error';
import { ErrorCodes } from '../validation/error.codes';
import { ArticleCommentView } from '../rest-service-views/respond-views/staff/media/article-comment.view';
import { TimeUtility } from '../utilities/time.utility';

@Controller('api/article-comment')
export class ArticleCommentController {

    @Post(':articleId')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async createArticleComment (req: InternalRequest, res: Response): Promise<void> {
        const lastCommentMade = await req.serviceConfig.articleCommentRepository.paginate({
            page: 1,
            take: 1,
            where: [
                { key: 'userId', operator: PaginationWhereOperators.EQUALS, value: req.user.userId },
                {
                    key: 'createdAt',
                    operator: PaginationWhereOperators.BIGGER,
                    value: TimeUtility.getCurrentTime() - 15
                },
            ]
        });
        if (lastCommentMade.getItems().length > 0) {
            res.status(BAD_REQUEST).json(ValidationError.newBuilder()
                .withMessage(ErrorCodes.SPAM.description)
                .withCode(ErrorCodes.SPAM.code)
                .withField('comment')
                .build());
            return;
        }

        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        if (!article) {
            res.status(NOT_FOUND).json();
            return;
        }

        if (!req.body.content) {
            res.status(BAD_REQUEST).json();
            return;
        }

        const entity = ArticleCommentEntity.newBuilder()
            .withArticleId(article.articleId)
            .withUserId(req.user.userId)
            .withContent(req.body.content)
            .build();

        const createdEntity = await req.serviceConfig.articleCommentRepository.save(entity);
        await Logger.createUserLog(req, {
            id: LogTypes.CREATED_ARTICLE_COMMENT,
            contentId: createdEntity.articleCommentId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: JSON.stringify(createdEntity)
        });
        res.status(OK).json(ArticleCommentView.newBuilder()
            .withArticleCommentId(createdEntity.articleCommentId)
            .withContent(createdEntity.content)
            .withUser(await req.serviceConfig.userRepository.getSlimUserById(req.user.userId))
            .build());
    }

    @Put(':articleCommentId')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async updateArticleComment (req: InternalRequest, res: Response): Promise<void> {
        const articleComment = await req.serviceConfig.articleCommentRepository.get(Number(req.params.articleCommentId));
        if (!articleComment) {
            res.status(NOT_FOUND).json();
            return;
        }

        if (!req.body.content || (articleComment.userId !== req.user.userId && !await this.canRequesterManageArticles(req))) {
            res.status(BAD_REQUEST).json();
            return;
        }

        const updatedEntity = articleComment.newBuilderFromCurrent()
            .withContent(req.body.content)
            .build();

        await req.serviceConfig.articleCommentRepository.save(updatedEntity);
        await Logger.createUserLog(req, {
            id: LogTypes.UPDATED_ARTICLE_COMMENT,
            contentId: articleComment.articleCommentId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(articleComment),
            afterChange: JSON.stringify(updatedEntity)
        });
        res.status(OK).json();
    }

    @Delete(':articleCommentId')
    @Middleware([AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_MANAGE_ARTICLES])])
    async deleteArticleComment (req: InternalRequest, res: Response): Promise<void> {
        const articleComment = await req.serviceConfig.articleCommentRepository.get(Number(req.params.articleCommentId));
        if (!articleComment) {
            res.status(NOT_FOUND).json();
            return;
        }

        await req.serviceConfig.articleCommentRepository.delete(articleComment);
        await Logger.createUserLog(req, {
            id: LogTypes.DELETED_ARTICLE_COMMENT,
            contentId: articleComment.articleCommentId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(articleComment),
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
