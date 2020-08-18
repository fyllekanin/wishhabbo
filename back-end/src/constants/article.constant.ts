export class ArticleConstants {

    static readonly VALID_ROOM_LINK = /(http(s)?:\/\/)?(www.)?habbo\.com\/(hotel\?)?room(=|\/)([0-9]+|(http(s)?:\/\/)?(www.)?habbo\.com\/hotel\?room=[0-9]+)?/g;
    static readonly DIFFICULTIES: { [key: string]: number } = {
        NONE: 0,
        EASY: 1,
        MEDIUM: 2,
        HARD: 3
    };

    static readonly TYPES: { [key: string]: { value: number, isBadgeMandatory: boolean } } = {
        GUIDE: {
            value: 0,
            isBadgeMandatory: true
        },
        NEWS: {
            value: 1,
            isBadgeMandatory: false
        },
        SITE_NEWS: {
            value: 2,
            isBadgeMandatory: false
        }
    };
}
