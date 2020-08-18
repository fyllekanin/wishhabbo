import { ValidationError } from '../../validation.error';
import { EntityValidator } from '../../entities/entity-validator.interface';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ArticlePayload } from '../../../rest-service-views/payloads/staff/media/article.payload';
import { ArticleRepository } from '../../../persistance/repositories/staff/media/article.repository';
import { ErrorCodes } from '../../error.codes';
import { ArticleConstants } from '../../../constants/article.constant';

export class ArticlePayloadValidator implements EntityValidator<ArticlePayload> {

    async validate (payload: IPayload): Promise<Array<ValidationError>> {
        const articleRepository = new ArticleRepository();
        const articlePayload = payload as ArticlePayload;
        const errors: Array<ValidationError> = [];

        await this.validateTitle(articlePayload, errors, articleRepository);
        this.validateRoomLink(articlePayload, errors);
        this.validateDifficulty(articlePayload, errors);
        this.validateType(articlePayload, errors);
        this.validateMandatoryBadge(articlePayload, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof ArticlePayload;
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
        if (!validTypes.includes(payload.getDifficulty())) {
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
        const items = await articleRepository.paginate({
            take: 1,
            page: 1,
            where: [ { key: 'title', operator: '=', value: payload.getTitle() } ]
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
