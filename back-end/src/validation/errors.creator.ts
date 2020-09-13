import { ErrorCode, ErrorCodes } from './error.codes';

export class ErrorsCreator {

    static createLikingRadioToFastError (min: string): ErrorCode {
        const copy = { ...ErrorCodes.LIKING_RADIO_TO_FAST };
        copy.description = copy.description.replace(`{${copy.parameters.min}}`, min);
        return copy;
    }
}
