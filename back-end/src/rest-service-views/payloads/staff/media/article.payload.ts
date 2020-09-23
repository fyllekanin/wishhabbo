import { IPayload } from '../../payload.interface';
import { File } from 'formidable';

export class ArticlePayload implements IPayload {
    private readonly articleId: number;
    private readonly title: string;
    private readonly content: string;
    private readonly badges: Array<string>;
    private readonly room: string;
    private readonly roomOwner: string;
    private readonly difficulty: number;
    private readonly type: number;
    private readonly isAvailable: boolean;
    private readonly file: File;

    constructor (
        articleId: number,
        title: string,
        content: string,
        badges: Array<string>,
        room: string,
        roomOwner: string,
        difficulty: number,
        type: number,
        isAvailable: boolean,
        file: File
    ) {
        this.articleId = articleId;
        this.title = title;
        this.content = content;
        this.badges = badges;
        this.room = room;
        this.roomOwner = roomOwner;
        this.difficulty = difficulty;
        this.type = type;
        this.file = file;
        this.isAvailable = isAvailable;
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

    getRoomOwner (): string {
        return this.roomOwner;
    }

    getDifficulty (): number {
        return this.difficulty;
    }

    getType (): number {
        return this.type;
    }

    getIsAvailable(): boolean {
        return this.isAvailable;
    }

    getFile (): File {
        return this.file;
    }

    static of (article: any, file: File, articleId: number): ArticlePayload {
        return new ArticlePayload(
            articleId,
            article.title,
            article.content,
            article.badges,
            article.room,
            article.roomOwner,
            article.difficulty,
            article.type,
            article.isAvailable,
            file
        );
    }
}
