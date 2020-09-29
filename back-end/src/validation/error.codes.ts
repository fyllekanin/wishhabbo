export interface ErrorCode {
    code: number;
    name: string;
    description: string;
    parameters?: { [key: string]: string | number };
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

    static readonly SPAM_ERROR: ErrorCode = {
        code: 7,
        name: 'Doing things to quick',
        description: 'You are currently doing things to quick'
    };

    static readonly UNIQUE_BBCODE_EXAMPLE: ErrorCode = {
        code: 8,
        name: 'Bbcode example uniqueness',
        description: 'A bbcodes example need to be unique'
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

    static readonly UNIQUE_BBCODE_NAME: ErrorCode = {
        code: 17,
        name: 'Bbcode name uniqueness',
        description: 'A bbcodes name need to be unique'
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

    static readonly EVENT_ALREADY_EXISTS: ErrorCode = {
        code: 22,
        name: 'Event with name already exists',
        description: 'Event with given name already exists'
    };

    static readonly GROUP_NAME_EXISTS: ErrorCode = {
        code: 23,
        name: 'Group name exists',
        description: 'Given group name already exists on another group'
    };

    static readonly GROUP_DISPLAY_NAME_EXISTS: ErrorCode = {
        code: 24,
        name: 'Group display name exists',
        description: 'Given group display name already exists on another group'
    };

    static readonly IMMUNITY: ErrorCode = {
        code: 25,
        name: 'Immunity to low',
        description: 'You do not have enough immunity for this'
    };

    static readonly INVALID_HEX_COLOR: ErrorCode = {
        code: 26,
        name: 'Invalid hex color',
        description: 'Given hex color is not a valid format'
    };

    static readonly CAN_NOT_MODIFY_PERMISSION: ErrorCode = {
        code: 27,
        name: 'You can not modify this permission',
        description: 'You can not modify permissions you do not have access to'
    };

    static readonly USER_WITH_HABBO_EXISTS: ErrorCode = {
        code: 28,
        name: 'Someone already got given habbo',
        description: 'Another user with given habbo already exists'
    };

    static readonly INVALID_GROUP_TO_ADD: ErrorCode = {
        code: 29,
        name: 'Group have to high immunity',
        description: 'Given group have higher immunity then user trying to add it'
    };

    static readonly INVALID_DISPLAY_GROUP: ErrorCode = {
        code: 30,
        name: 'Invalid display group',
        description: 'Given display group is not a group the user have'
    };

    static readonly GROUP_DO_NOT_EXIST: ErrorCode = {
        code: 31,
        name: 'Group does not exist',
        description: 'Given group does not exist'
    };

    static readonly INVALID_RADIO_PORT: ErrorCode = {
        code: 32,
        name: 'Invalid radio port',
        description: 'The radio port needs to be a number'
    };

    static readonly MISSING_RADIO_FIELDS: ErrorCode = {
        code: 33,
        name: 'Missing mandatory fields',
        description: 'Radio settings need to have host, port, password, adminPassword and server type selected'
    };

    static readonly INVALID_SERVER_TYPE: ErrorCode = {
        code: 34,
        name: 'Invalid server type',
        description: 'Given server type is not one of the supported server types'
    };

    static readonly LIKING_RADIO_TO_FAST: ErrorCode = {
        code: 35,
        name: 'Liking the DJ to quick',
        description: 'You have already liked the current DJ, you need to wait {min} minutes',
        parameters: {
            min: 'min'
        }
    };

    static readonly INVALID_ROLE: ErrorCode = {
        code: 36,
        name: 'Invalid role',
        description: 'A role can only contain a-z and spaces'
    };

    static readonly SYSTEM_BBCODE: ErrorCode = {
        code: 37,
        name: 'System bbcode can not be edited',
        description: 'A system bbcode can not be changed or deleted'
    };

    static readonly EMPTY_FIELD: ErrorCode = {
        code: 38,
        name: 'Field can not be empty',
        description: 'The given field can not be empty'
    };

    static readonly HABBO_TO_YOUNG: ErrorCode = {
        code: 39,
        name: 'To young habbo',
        description: 'Your habbo needs to be at least 1 week old'
    };
}
