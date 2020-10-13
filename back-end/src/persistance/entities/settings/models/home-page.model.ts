export interface HomePageStarLight {
    userId: number;
    text: string;
}

export interface HomePageBannerEntry {
    id: string;
    caption: string;
}

export interface HomePagemodel {
    starLight: HomePageStarLight;
    bannerEntries: Array<HomePageBannerEntry>;
}
