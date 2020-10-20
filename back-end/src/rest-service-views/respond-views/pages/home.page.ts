import { ArticleView } from '../staff/media/article.view';
import { TimetableSlot } from '../../two-way/staff/timetable.slot';
import { BadgeView } from '../badge.view';
import { HomePageBannerEntry, HomePageStarLight } from '../../two-way/home-page.view';

export class HomePage {
    private readonly badges: Array<BadgeView>;
    private readonly guides: Array<ArticleView>;
    private readonly habboNews: Array<ArticleView>;
    private readonly siteNews: Array<ArticleView>;
    private readonly todayEvents: Array<TimetableSlot>;
    private readonly starLight: HomePageStarLight;
    private readonly bannerEntries: Array<HomePageBannerEntry>;

    constructor (builder: Builder) {
        this.badges = [...builder.badges];
        this.guides = [...builder.guides];
        this.habboNews = [...builder.habboNews];
        this.siteNews = [...builder.siteNews];
        this.todayEvents = [...builder.todayEvents];
        this.starLight = builder.starLight;
        this.bannerEntries = [...builder.bannerEntries];
    }

    getBadges (): Array<BadgeView> {
        return [...this.badges];
    }

    getGuides (): Array<ArticleView> {
        return [...this.guides];
    }

    getHabboNews (): Array<ArticleView> {
        return [...this.habboNews];
    }

    getSiteNews (): Array<ArticleView> {
        return [...this.siteNews];
    }

    getTodayEvents (): Array<TimetableSlot> {
        return [...this.todayEvents];
    }

    getStarLight (): HomePageStarLight {
        return this.starLight;
    }

    getBannerEntries (): Array<HomePageBannerEntry> {
        return [...this.bannerEntries];
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    badges: Array<BadgeView>;
    guides: Array<ArticleView>;
    habboNews: Array<ArticleView>;
    siteNews: Array<ArticleView>;
    todayEvents: Array<TimetableSlot>;
    starLight: HomePageStarLight;
    bannerEntries: Array<HomePageBannerEntry>;

    withBadges (badges: Array<BadgeView>): Builder {
        this.badges = [...badges];
        return this;
    }

    withGuides (guides: Array<ArticleView>): Builder {
        this.guides = [...guides];
        return this;
    }

    withHabboNews (habboNews: Array<ArticleView>): Builder {
        this.habboNews = [...habboNews];
        return this;
    }

    withSiteNews (siteNews: Array<ArticleView>): Builder {
        this.siteNews = [...siteNews];
        return this;
    }

    withTodaysEvents (slots: Array<TimetableSlot>): Builder {
        this.todayEvents = [...slots];
        return this;
    }

    withStarLight (starLight: HomePageStarLight): Builder {
        this.starLight = starLight;
        return this;
    }

    withBannerEntries (bannerEntries: Array<HomePageBannerEntry>): Builder {
        this.bannerEntries = [...bannerEntries];
        return this;
    }

    build (): HomePage {
        return new HomePage(this);
    }
}
