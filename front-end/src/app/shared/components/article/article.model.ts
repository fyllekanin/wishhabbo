import { ClassHelper, primitiveOf } from '../../helpers/class.helper';

export class Article {
    @primitiveOf(Number)
    articleId: number;
    @primitiveOf(String)
    title: string;
    @primitiveOf(String)
    author: string;
    @primitiveOf(String)
    badge: string;

    constructor (source: Partial<Article>) {
        ClassHelper.assign(this, source);
    }

    get thumbnail (): string {
        return `url(/assets/images/temp/${this.articleId}.png)`;
    }
}
