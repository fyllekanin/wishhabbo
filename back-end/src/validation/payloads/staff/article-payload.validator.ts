import { ValidationError } from '../../validation.error';
import { EntityValidator } from '../../entities/entity-validator.interface';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ArticlePayload } from '../../../rest-service-views/payloads/staff/media/article.payload';
import { ArticleRepository } from '../../../persistance/repositories/staff/media/article.repository';
import { ErrorCodes } from '../../error.codes';
import { ArticleConstants } from '../../../constants/article.constant';
import { ServiceConfig } from '../../../utilities/internal.request';
import { ResourceRepository } from '../../../persistance/repositories/resource.repository';

export class ArticlePayloadValidator implements EntityValidator<ArticlePayload> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig): Promise<Array<ValidationError>> {
        const articlePayload = payload as ArticlePayload;
        const errors: Array<ValidationError> = [];

        await this.validateTitle(articlePayload, errors, serviceConfig.articleRepository);
        this.validateRoomLink(articlePayload, errors);
        this.validateDifficulty(articlePayload, errors);
        this.validateType(articlePayload, errors);
        this.validateMandatoryBadge(articlePayload, errors);
        await this.validateThumbnail(articlePayload, errors, serviceConfig.resourceRepository);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof ArticlePayload;
    }

    private async validateThumbnail (payload: ArticlePayload, errors: Array<ValidationError>,
                                     resourceRepository: ResourceRepository): Promise<void> {
        if (!resourceRepository.isFileValidImage(payload.getFile())) {
            errors.push(ValidationError.newBuilder()
                .withField('thumbnail')
                .withMessage(ErrorCodes.INVALID_IMAGE_FILE.description)
                .withCode(ErrorCodes.INVALID_IMAGE_FILE.code)
                .build());
        }
    }

    private validateDifficulty (payload: ArticlePayload, errors: Array<ValidationError>): void {
        const validDifficulties = Object.keys(ArticleConstants.DIFFICULTIES)
            .map(key => ArticleConstants.DIFFICULTIES[key]);
        if (!validDifficulties.includes(payload.getDifficulty())) {
            errors.push(ValidationError.newBuilder()
                .withField('difficulty')
                .withMessage(ErrorCodes.NOT_VALID_ARTICLE_DIFFICULTY.description)
                .withCode(ErrorCodes.NOT_VALID_ARTICLE_DIFFICULTY.code)
                .build());
        }
    }

    private validateMandatoryBadge (payload: ArticlePayload, errors: Array<ValidationError>): void {
        const isBadgeMandatory = Object.keys(ArticleConstants.TYPES)
            .filter(key => ArticleConstants.TYPES[key].value === payload.getType())
            .some(key => ArticleConstants.TYPES[key].isBadgeMandatory);

        if (isBadgeMandatory && payload.getBadges().length === 0) {
            errors.push(ValidationError.newBuilder()
                .withField('badges')
                .withMessage(ErrorCodes.MISSING_BADGE_WHEN_MANDATORY.description)
                .withCode(ErrorCodes.MISSING_BADGE_WHEN_MANDATORY.code)
                .build());
        }
    }

    private validateType (payload: ArticlePayload, errors: Array<ValidationError>): void {
        const validTypes = Object.keys(ArticleConstants.TYPES)
            .map(key => ArticleConstants.TYPES[key].value);
        if (!validTypes.includes(payload.getType())) {
            errors.push(ValidationError.newBuilder()
                .withField('difficulty')
                .withMessage(ErrorCodes.NOT_VALID_ARTICLE_TYPE.description)
                .withCode(ErrorCodes.NOT_VALID_ARTICLE_TYPE.code)
                .build());
        }
    }

    private validateRoomLink (payload: ArticlePayload, errors: Array<ValidationError>): void {
        if (!payload.getRoom() || payload.getRoom().length === 0) {
            return;
        }
        if (!payload.getRoom().match(ArticleConstants.VALID_ROOM_LINK)) {
            errors.push(ValidationError.newBuilder()
                .withField('room')
                .withMessage(ErrorCodes.NOT_VALID_HABBO_ROOM_LINK.description)
                .withCode(ErrorCodes.NOT_VALID_HABBO_ROOM_LINK.code)
                .build());
        }
    }

    private async validateTitle (payload: ArticlePayload, errors: Array<ValidationError>,
                                 articleRepository: ArticleRepository): Promise<void> {
        const wheres = payload.getArticleId() ?
            [
                { key: 'title', operator: '=', value: payload.getTitle() },
                { key: 'articleId', operator: '!=', value: payload.getArticleId() }
            ]
            :
            [
                { key: 'title', operator: '=', value: payload.getTitle() }
            ];
        const items = await articleRepository.paginate({
            take: 1,
            page: 1,
            where: wheres
        });

        if (items.getItems().length > 0) {
            errors.push(ValidationError.newBuilder()
                .withField('title')
                .withMessage(ErrorCodes.NON_UNIQUE_ARTICLE_TITLE.description)
                .withCode(ErrorCodes.NON_UNIQUE_ARTICLE_TITLE.code)
                .build());
        }
    }
}
