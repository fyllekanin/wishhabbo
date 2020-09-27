import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { arrayOf, ClassHelper, objectOf, primitiveOf } from '../../helpers/class.helper';
import { SlimUser } from '../slim-user.class';

export const ARTICLE_TYPES = {
    0: {
        name: 'Guide',
        isBadgeIncluded: true
    },
    1: {
        name: 'News',
        isBadgeIncluded: false
    },
    2: {
        name: 'Site News',
        isBadgeIncluded: false
    }
};

export const ARTICLE_DIFFICULTIES = {
    0: {
        name: 'None',
        color: null
    },
    1: {
        name: 'Easy',
        color: 'green'
    },
    2: {
        name: 'Medium',
        color: 'blue'
    },
    3: {
        name: 'Hard',
        color: 'red'
    }
};

export class ArticleClass {
    @primitiveOf(Number)
    articleId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitiveOf(String)
    title: string;
    @primitiveOf(String)
    parsedContent: string;
    @primitiveOf(String)
    content: string;
    @arrayOf(String)
    badges: Array<string> = [];
    @primitiveOf(String)
    room: string;
    @primitiveOf(String)
    roomOwner: string;
    @primitiveOf(Number)
    difficulty: number;
    @primitiveOf(Number)
    type: number;
    @primitiveOf(Boolean)
    isApproved: boolean;
    @primitiveOf(Boolean)
    isAvailable: boolean;
    @primitiveOf(Boolean)
    isPaid: boolean;
    @primitiveOf(Number)
    updatedAt: number;

    constructor (source: Partial<ArticleClass>) {
        ClassHelper.assign(this, source);
    }

    getType (): { name: string, isBadgeIncluded: boolean } {
        const type = ARTICLE_TYPES[this.type];
        return type ? type : {
            name: 'Unknown',
            isBadgeIncluded: false
        };
    }

    get thumbnail (): string {
        return `/resources/article-thumbnails/${this.articleId}.gif?updatedAt=${this.updatedAt}`;
    }
}
