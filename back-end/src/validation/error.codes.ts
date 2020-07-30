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
}
