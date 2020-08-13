import { IPayload } from '../../payload.interface';
import { InternalRequest } from '../../../../utilities/internal.request';

export class ArticlePayload implements IPayload {
    private readonly articleId: number;
    private readonly title: string;
    private readonly content: string;
    private readonly badges: Array<string>;
    private readonly room: string;
    private readonly difficulty: number;

    constructor (
        articleId: number,
        title: string,
        content: string,
        badges: Array<string>,
        room: string,
        difficulty: number
    ) {
        this.articleId = articleId;
        this.title = title;
        this.content = content;
        this.badges = badges;
        this.room = room;
        this.difficulty = difficulty;
    }

    getArticleId (): number {
        return this.articleId;
    }

    getTitle (): string {
        return this.title;
    }

    getContent (): string {
        return this.content;
    }

    getBadges (): Array<string> {
        return [ ...this.badges ];
    }

    getRoom (): string {
        return this.room;
    }

    getDifficulty (): number {
        return this.difficulty;
    }

    static of (req: InternalRequest): ArticlePayload {
        const {
            articleId,
            title,
            content,
            badges,
            room,
            difficulty
        } = req.body;
        return new ArticlePayload(
            articleId,
            title,
            content,
            badges,
            room,
            difficulty
        );
    }
}
