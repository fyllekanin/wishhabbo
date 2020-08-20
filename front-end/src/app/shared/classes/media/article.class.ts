import { arrayOf, ClassHelper, objectOf, primitiveOf } from '../../helpers/class.helper';
import { SlimUser } from '../slim-user.class';

export const ARTICLE_TYPES = {
    0: {
        name: 'Guide',
        isBadgeMandatory: true
    },
    1: {
        name: 'News',
        isBadgeMandatory: false
    },
    2: {
        name: 'Site News',
        isBadgeMandatory: false
    }
};

export const ARTICLE_DIFFICULTIES = {
    0: {
        name: 'None'
    },
    1: {
        name: 'Easy'
    },
    2: {
        name: 'Medium'
    },
    3: {
        name: 'Hard'
    }
};

export class ArticleClass {
    private parsedBadges: Array<string> = [];

    @primitiveOf(Number)
    articleId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitiveOf(String)
    title: string;
    @primitiveOf(String)
    content: string;
    @arrayOf(String)
    badges: Array<string> = [];
    @primitiveOf(String)
    room: string;
    @primitiveOf(Number)
    difficulty: number;
    @primitiveOf(Number)
    type: number;
    @primitiveOf(Boolean)
    isApproved: boolean;

    constructor (source: Partial<ArticleClass>) {
        ClassHelper.assign(this, source);
    }

    getType (): { name: string, isBadgeMandatory: boolean } {
        const type = ARTICLE_TYPES[this.type];
        return type ? type : {
            name: 'Unknown',
            isBadgeMandatory: false
        };
    }
}
