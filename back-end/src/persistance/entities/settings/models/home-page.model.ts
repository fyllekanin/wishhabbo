export interface HomePageStarLight {
    userId: number;
    text: string;
}

export interface HomePageBannerEntry {
    id: string;
    caption: string;
}

export interface HomePageModel {
    starLight: HomePageStarLight;
    bannerEntries: Array<HomePageBannerEntry>;
}
