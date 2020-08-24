export interface ErrorCode {
    code: number;
    name: string;
    description: string;
}

export class ErrorCodes {

    static readonly INVALID_USERNAME: ErrorCode = {
        code: 1,
        name: 'Invalid username',
        description: 'The username given is invalid, usernames can only contain alphanumeric characters'
    };

    static readonly EXISTING_USERNAME: ErrorCode = {
        code: 2,
        name: 'Existing username',
        description: 'The username given already exists in the system'
    };

    static readonly INVALID_PASSWORD: ErrorCode = {
        code: 3,
        name: 'Invalid password',
        description: 'The password given is invalid, passwords need to be at least 8 characters long'
    };

    static readonly INVALID_CONFIRMED_PASSWORD: ErrorCode = {
        code: 4,
        name: 'Invalid confirmed password',
        description: 'The two passwords given in registration are not matching'
    };

    static readonly NO_HABBO_WITH_NAME: ErrorCode = {
        code: 5,
        name: 'Habbo user do not exist',
        description: 'No habbo user with given name exists'
    };

    static readonly HABBO_MOTTO_INCORRECT: ErrorCode = {
        code: 6,
        name: 'Incorrect habbo motto',
        description: 'The current motto on the given habbo user is incorrect'
    };

    static readonly EMPTY_USERNAME: ErrorCode = {
        code: 7,
        name: 'Username empty',
        description: 'The username can not be empty while logging in'
    };

    static readonly EMPTY_PASSWORD: ErrorCode = {
        code: 8,
        name: 'Password empty',
        description: 'The password can not be empty while logging in'
    };

    static readonly FAILED_LOGIN: ErrorCode = {
        code: 9,
        name: 'No user with username and password',
        description: 'No user with the given username and password'
    };

    static readonly INVALID_REFRESH_TOKEN: ErrorCode = {
        code: 10,
        name: 'Refresh token invalid',
        description: 'Given refresh token do not exist'
    };

    static readonly NON_UNIQUE_ARTICLE_TITLE: ErrorCode = {
        code: 11,
        name: 'Article title is not unique',
        description: 'Give article title already exists'
    };

    static readonly NOT_VALID_HABBO_ROOM_LINK: ErrorCode = {
        code: 12,
        name: 'Habbo room link is not valid',
        description: 'Given habbo room link is not a valid link'
    };

    static readonly NOT_VALID_ARTICLE_DIFFICULTY: ErrorCode = {
        code: 13,
        name: 'Invalid article difficulty',
        description: 'Given difficulty is not valid'
    };

    static readonly NOT_VALID_ARTICLE_TYPE: ErrorCode = {
        code: 14,
        name: 'Invalid article type',
        description: 'Given type is not valid'
    };

    static readonly MISSING_BADGE_WHEN_MANDATORY: ErrorCode = {
        code: 15,
        name: 'Missing badges on mandatory article type',
        description: 'On given article type it is mandatory to have at least one badge set'
    };

    static readonly INVALID_IMAGE_FILE: ErrorCode = {
        code: 16,
        name: 'Given file is not an image',
        description: 'Given file is either not the correct format or is corrupt'
    };

    static readonly MISSING_CONTENT: ErrorCode = {
        code: 17,
        name: 'Content is empty',
        description: 'The content is not valid as it\'s empty'
    };

    static readonly ALREADY_TAKEN_SLOT: ErrorCode = {
        code: 18,
        name: 'Slot already booked',
        description: 'The slot is already booked'
    };

    static readonly NO_USER_WITH_USERNAME: ErrorCode = {
        code: 19,
        name: 'No user with username',
        description: 'There is no user with given username'
    };

    static readonly INVALID_EVENT: ErrorCode = {
        code: 20,
        name: 'No event with given id',
        description: 'There is no event with given id'
    };

    static readonly CAN_NOT_BOOK_FOR_OTHERS: ErrorCode = {
        code: 21,
        name: 'No permission for booking for others',
        description: 'You do not have permission to book for other users'
    };
}
