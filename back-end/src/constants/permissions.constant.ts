import { StringKeyValue } from '../utilities/object.interface';

export class Permissions {

    static readonly STAFF: StringKeyValue<number> = {
        CAN_BOOK_RADIO: 1,
        CAN_BOOK_EVENTS: 2,
        CAN_UNBOOK_OTHERS_RADIO: 4,
        CAN_UNBOOK_OTHERS_EVENTS: 8,
        CAN_WRITE_ARTICLES: 16,
        CAN_MANAGE_ARTICLES: 32,
        CAN_KICK_DJ_OFF_AIR: 64,
        CAN_MANAGE_EVENTS: 128
    };

    static readonly ADMIN: StringKeyValue<number> = {
        CAN_MANAGE_GROUPS: 1,
        CAN_MANAGE_USER_BASICS: 2,
        CAN_MANAGE_USER_GROUPS: 4,
        CAN_MANAGE_WEBSITE_SETTINGS: 8,
        CAN_SEE_LOGS: 16,
        CAN_UPLOAD_RESOURCES: 32
    };
}
