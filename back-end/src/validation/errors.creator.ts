import { ErrorCodes } from './error.codes';
import { ValidationError } from './validation.error';

export class ErrorsCreator {

    static createLikingRadioToFastValidationError (min: string): ValidationError {
        return ValidationError.newBuilder()
            .withCode(ErrorCodes.LIKING_RADIO_TO_FAST.code)
            .withField('like')
            .withMessage(ErrorCodes.LIKING_RADIO_TO_FAST.description
                .replace(`{${ErrorCodes.LIKING_RADIO_TO_FAST.parameters.min}}`, min))
            .build();
    }
}
