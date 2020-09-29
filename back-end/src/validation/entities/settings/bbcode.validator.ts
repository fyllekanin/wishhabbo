import { EntityValidator } from '../entity-validator.interface';
import { ValidationError } from '../../validation.error';
import { IEntity } from '../../../persistance/entities/entity.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { BbcodeEntity } from '../../../persistance/entities/settings/bbcode.entity';
import { ErrorCodes } from '../../error.codes';
import { PaginationWhereOperators } from '../../../persistance/repositories/base.repository';

export class BbcodeValidator implements EntityValidator<BbcodeEntity> {

    async validate (entity: IEntity, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const bbcodeEntity = entity as BbcodeEntity;
        const errors: Array<ValidationError> = [];

        await this.validateIfSystemBbcode(bbcodeEntity, serviceConfig, errors);
        await this.validateName(bbcodeEntity, serviceConfig, errors);
        await this.validateExample(bbcodeEntity, serviceConfig, errors);
        this.validateValidatePatternAndReplacement(bbcodeEntity, errors);
        this.validateValidateEditorPatternAndReplacement(bbcodeEntity, errors);

        return errors;
    }

    isValidEntity (entity: IEntity): boolean {
        return entity instanceof BbcodeEntity;
    }

    private async validateIfSystemBbcode (entity: BbcodeEntity, serviceConfig: ServiceConfig,
                                          errors: Array<ValidationError>): Promise<void> {
        if (!entity.bbcodeId) {
            return;
        }

        const items = await serviceConfig.bbcodeRepository.paginate({
            take: 1,
            page: 1,
            where: [
                { key: 'bbcodeId', operator: PaginationWhereOperators.EQUALS, value: entity.bbcodeId },
                { key: 'isSystem', operator: PaginationWhereOperators.EQUALS, value: true }
            ]
        });

        if (items.getItems().length > 0) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.SYSTEM_BBCODE.code)
                .withField('bbcodeId')
                .withMessage(ErrorCodes.SYSTEM_BBCODE.description)
                .build());
        }
    }

    private async validateName (entity: BbcodeEntity, serviceConfig: ServiceConfig, errors: Array<ValidationError>): Promise<void> {
        if (!entity.name) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('name')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
            return;
        }

        const wheres = entity.bbcodeId ?
            [{ key: 'bbcodeId', operator: PaginationWhereOperators.NOT_EQUALS, value: entity.bbcodeId }, {
                key: 'name',
                operator: PaginationWhereOperators.EQUALS,
                value: entity.name
            }]
            : [{ key: 'name', operator: PaginationWhereOperators.EQUALS, value: entity.name }];
        const items = await serviceConfig.bbcodeRepository.paginate({
            take: 1,
            page: 1,
            where: wheres
        });

        if (items.getItems().length > 0) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.UNIQUE_BBCODE_NAME.code)
                .withField('name')
                .withMessage(ErrorCodes.UNIQUE_BBCODE_NAME.description)
                .build());
        }
    }

    private async validateExample (entity: BbcodeEntity, serviceConfig: ServiceConfig, errors: Array<ValidationError>): Promise<void> {
        if (!entity.example) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('example')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
            return;
        }

        const wheres = entity.bbcodeId ?
            [{ key: 'bbcodeId', operator: PaginationWhereOperators.NOT_EQUALS, value: entity.bbcodeId }, {
                key: 'example',
                operator: PaginationWhereOperators.EQUALS,
                value: entity.example
            }]
            : [{ key: 'example', operator: PaginationWhereOperators.EQUALS, value: entity.example }];
        const items = await serviceConfig.bbcodeRepository.paginate({
            take: 1,
            page: 1,
            where: wheres
        });

        if (items.getItems().length > 0) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.UNIQUE_BBCODE_EXAMPLE.code)
                .withField('example')
                .withMessage(ErrorCodes.UNIQUE_BBCODE_EXAMPLE.description)
                .build());
        }
    }

    private validateValidatePatternAndReplacement (entity: BbcodeEntity, errors: Array<ValidationError>): void {
        if (!entity.pattern) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('pattern')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
        }

        if (!entity.replacement) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('replacement')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
        }
    }

    private validateValidateEditorPatternAndReplacement (entity: BbcodeEntity, errors: Array<ValidationError>): void {
        if (!entity.editorPattern) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('editorPattern')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
        }

        if (!entity.editorReplacement) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('editorReplacement')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
        }
    }
}
