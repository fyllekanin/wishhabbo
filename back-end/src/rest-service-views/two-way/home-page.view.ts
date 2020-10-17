import { SlimUserView } from './slim-user.view';
import { File } from 'formidable';

export class HomePageStarLight {
    private readonly user: SlimUserView;
    private readonly text: string;

    constructor (builder: HomePageStarLightBuilder) {
        this.user = builder.user;
        this.text = builder.text;
    }

    getUser (): SlimUserView {
        return this.user;
    }

    getText (): string {
        return this.text;
    }

    static newBuilder (): HomePageStarLightBuilder {
        return new HomePageStarLightBuilder();
    }
}

class HomePageStarLightBuilder {
    user: SlimUserView;
    text: string;

    withUser (user: SlimUserView): HomePageStarLightBuilder {
        this.user = user;
        return this;
    }

    withText (text: string): HomePageStarLightBuilder {
        this.text = text;
        return this;
    }

    build (): HomePageStarLight {
        return new HomePageStarLight(this);
    }
}

export class HomePageBannerEntry {
    private readonly id: string;
    private readonly caption: string;
    private readonly isDeleted: boolean;
    private readonly isUpdated: boolean;
    private readonly isNew: boolean;
    private readonly file: File;

    constructor (builder: HomePageBannerEntryBuilder) {
        this.id = builder.id;
        this.caption = builder.caption;
        this.isDeleted = builder.isDeleted;
        this.isUpdated = builder.isUpdated;
        this.isNew = builder.isNew;
        this.file = builder.file;
    }

    getId (): string {
        return this.id;
    }

    getCaption (): string {
        return this.caption;
    }

    getIsDeleted (): boolean {
        return this.isDeleted;
    }

    getIsUpdated (): boolean {
        return this.isUpdated;
    }

    getIsNew (): boolean {
        return this.isNew;
    }

    getFile (): File {
        return this.file;
    }

    static newBuilder (): HomePageBannerEntryBuilder {
        return new HomePageBannerEntryBuilder();
    }
}

class HomePageBannerEntryBuilder {
    id: string;
    caption: string;
    isDeleted: boolean;
    isUpdated: boolean;
    isNew: boolean;
    file: File;

    withId (id: string): HomePageBannerEntryBuilder {
        this.id = id;
        return this;
    }

    withCaption (caption: string): HomePageBannerEntryBuilder {
        this.caption = caption;
        return this;
    }

    withIsDeleted (isDeleted: boolean): HomePageBannerEntryBuilder {
        this.isDeleted = isDeleted;
        return this;
    }

    withIsUpdated (isUpdated: boolean): HomePageBannerEntryBuilder {
        this.isUpdated = isUpdated;
        return this;
    }

    withIsNew (isNew: boolean): HomePageBannerEntryBuilder {
        this.isNew = isNew;
        return this;
    }

    withFile (file: File): HomePageBannerEntryBuilder {
        this.file = file;
        return this;
    }

    build (): HomePageBannerEntry {
        return new HomePageBannerEntry(this);
    }
}


export class HomePageView {
    private readonly starLight: HomePageStarLight;
    private readonly bannerEntries: Array<HomePageBannerEntry>;

    constructor (builder: HomePageViewBuilder) {
        this.starLight = builder.starLight;
        this.bannerEntries = [...builder.bannerEntries];
    }

    getStarLight (): HomePageStarLight {
        return this.starLight;
    }

    getBannerEntries (): Array<HomePageBannerEntry> {
        return [...this.bannerEntries];
    }

    static newBuilder (): HomePageViewBuilder {
        return new HomePageViewBuilder();
    }

    static of (body: any, files: { [key: string]: File }): HomePageView {
        const bannerEntries = body.bannerEntries.map((entry: any) => HomePageBannerEntry.newBuilder()
            .withId(entry.id)
            .withCaption(entry.caption)
            .withFile(files[entry.id])
            .withIsDeleted(entry.isDeleted)
            .withIsUpdated(entry.isUpdated)
            .withIsNew(entry.isNew)
            .build());

        return HomePageView.newBuilder()
            .withStarLight(HomePageStarLight.newBuilder()
                .withText(body.starLight.text)
                .withUser(body.starLight.user.userId ? new SlimUserView(body.starLight.user.userId) : null)
                .build())
            .withBannerEntries(bannerEntries)
            .build();
    }
}

class HomePageViewBuilder {
    starLight: HomePageStarLight;
    bannerEntries: Array<HomePageBannerEntry>;

    withStarLight (starLight: HomePageStarLight): HomePageViewBuilder {
        this.starLight = starLight;
        return this;
    }

    withBannerEntries (bannerEntries: Array<HomePageBannerEntry>): HomePageViewBuilder {
        this.bannerEntries = [...bannerEntries];
        return this;
    }

    build (): HomePageView {
        return new HomePageView(this);
    }
}
