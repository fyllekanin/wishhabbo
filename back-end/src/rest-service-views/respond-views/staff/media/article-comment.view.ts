import { SlimUserView } from '../../../two-way/slim-user.view';

export class ArticleCommentView {
    articleCommentId: number;
    user: SlimUserView;
    content: string;

    static newBuilder (): ArticleCommentViewBuilder {
        return new ArticleCommentViewBuilder();
    }
}

class ArticleCommentViewBuilder {
    articleCommentId: number;
    user: SlimUserView;
    content: string;

    withArticleCommentId (articleCommentId: number): ArticleCommentViewBuilder {
        this.articleCommentId = articleCommentId;
        return this;
    }

    withUser (user: SlimUserView): ArticleCommentViewBuilder {
        this.user = user;
        return this;
    }

    withContent (content: string): ArticleCommentViewBuilder {
        this.content = content;
        return this;
    }

    build (): ArticleCommentView {
        const entity = new ArticleCommentView();
        entity.articleCommentId = this.articleCommentId;
        entity.user = this.user;
        entity.content = this.content;
        return entity;
    }
}
