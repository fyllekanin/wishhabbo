import { HabboBadgeEntity } from '../../../persistance/entities/habbo/habbo-badge.entity';
import { ArticleView } from '../staff/media/article.view';

export class HomePage {
    private readonly badges: Array<HabboBadgeEntity>;
    private readonly guides: Array<ArticleView>;
    private readonly habboNews: Array<ArticleView>;
    private readonly siteNews: Array<ArticleView>;

    constructor (builder: Builder) {
        this.badges = [ ...builder.badges ];
        this.guides = [ ...builder.guides ];
        this.habboNews = [ ...builder.habboNews ];
        this.siteNews = [ ...builder.siteNews ];
    }

    getBadges (): Array<HabboBadgeEntity> {
        return [ ...this.badges ];
    }

    getGuides (): Array<ArticleView> {
        return [ ...this.guides ];
    }

    getHabboNews (): Array<ArticleView> {
        return [ ...this.habboNews ];
    }

    getSiteNews (): Array<ArticleView> {
        return [ ...this.siteNews ];
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    badges: Array<HabboBadgeEntity>;
    guides: Array<ArticleView>;
    habboNews: Array<ArticleView>;
    siteNews: Array<ArticleView>;

    withBadges (badges: Array<HabboBadgeEntity>): Builder {
        this.badges = [ ...badges ];
        return this;
    }

    withGuides (guides: Array<ArticleView>): Builder {
        this.guides = [ ...guides ];
        return this;
    }

    withHabboNews (habboNews: Array<ArticleView>): Builder {
        this.habboNews = [ ...habboNews ];
        return this;
    }

    withSiteNews (siteNews: Array<ArticleView>): Builder {
        this.siteNews = [ ...siteNews ];
        return this;
    }

    build (): HomePage {
        return new HomePage(this);
    }
}
