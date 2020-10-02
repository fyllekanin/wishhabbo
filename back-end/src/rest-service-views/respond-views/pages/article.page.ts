import { ArticleView } from '../staff/media/article.view';
import { BadgeView } from '../badge.view';

export class ArticlePage {
    private readonly article: ArticleView;
    private readonly badges: Array<BadgeView>;

    constructor (builder: Builder) {
        this.article = builder.article;
        this.badges = [...builder.badges];
    }

    getArticle (): ArticleView {
        return this.article;
    }

    getBadges (): Array<BadgeView> {
        return [...this.badges];
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    article: ArticleView;
    badges: Array<BadgeView>;

    withArticle (article: ArticleView): Builder {
        this.article = article;
        return this;
    }

    withBadges (badges: Array<BadgeView>): Builder {
        this.badges = [...badges];
        return this;
    }

    build (): ArticlePage {
        return new ArticlePage(this);
    }
}
