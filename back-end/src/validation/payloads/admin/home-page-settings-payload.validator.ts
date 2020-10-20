import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { ErrorCodes } from '../../error.codes';
import { HomePageBannerEntry, HomePageView } from '../../../rest-service-views/two-way/home-page.view';
import { UserRepository } from '../../../persistance/repositories/user/user.repository';

export class HomePageSettingsPayloadValidator implements PayloadValidator<HomePageView> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const homePageView = payload as HomePageView;
        const errors: Array<ValidationError> = [];

        await this.validateStarlight(homePageView, serviceConfig.userRepository, errors);
        for (const entry of homePageView.getBannerEntries()) {
            await this.validateBannerEntry(entry, errors);
        }

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof HomePageView;
    }

    private async validateBannerEntry (entry: HomePageBannerEntry, errors: Array<ValidationError>): Promise<void> {
        if (!entry.getFile() && ((entry.getIsNew() || entry.getIsUpdated()) && !entry.getIsDeleted())) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.FILE_MISSING.code)
                .withField('file')
                .withMessage(ErrorCodes.FILE_MISSING.description)
                .build());
        }
    }

    private async validateStarlight (payload: HomePageView, userRepository: UserRepository,
                                     errors: Array<ValidationError>): Promise<void> {
        if (payload.getStarLight().getUser().getUsername() &&
            !await userRepository.getUserWithUsername(payload.getStarLight().getUser().getUsername())) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.NO_USER_WITH_USERNAME.code)
                .withField('username')
                .withMessage(ErrorCodes.NO_USER_WITH_USERNAME.description)
                .build());
        }
        if (payload.getStarLight().getUser().getUsername() && !payload.getStarLight().getText()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('text')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
        }
    }
}
