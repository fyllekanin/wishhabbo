import { ArticleEntity } from '../persistance/entities/staff/media/article.entity';
import { PaginationView } from '../rest-service-views/respond-views/pagination.view';
import { PaginationHelper } from '../helpers/pagination.helper';
import { PaginationValue, RequestUtility } from '../utilities/request.utility';
import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest, ServiceConfig } from '../utilities/internal.request';
import { StaffListModel } from '../persistance/entities/settings/models/staff-list.model';
import { SettingKey } from '../persistance/entities/settings/setting.entity';
import { StaffListPage, StaffListRow } from '../rest-service-views/respond-views/pages/staff-list.page';
import { NOT_FOUND, OK } from 'http-status-codes';
import { HomePage } from '../rest-service-views/respond-views/pages/home.page';
import { ArticleConstants } from '../constants/article.constant';
import { ArticleView } from '../rest-service-views/respond-views/staff/media/article.view';
import { TimetableSlot } from '../rest-service-views/two-way/staff/timetable.slot';
import { TimetableType } from '../persistance/entities/staff/timetable.entity';
import { TimeUtility } from '../utilities/time.utility';
import { TimetableUtility } from '../utilities/timetable.utility';
import { PaginationWhereOperators } from '../persistance/repositories/base.repository';
import { ArticlePage } from '../rest-service-views/respond-views/pages/article.page';
import { BadgeView } from '../rest-service-views/respond-views/badge.view';
import { AUTHORIZATION_MIDDLEWARE } from './middlewares/authorization.middleware';
import { BadgeCompleteEntity } from '../persistance/entities/habbo/badge-complete.entity';
import { Logger } from '../logging/log.logger';
import { LogTypes } from '../logging/log.types';
import { HomePageModel } from '../persistance/entities/settings/models/home-page.model';
import { HomePageBannerEntry, HomePageStarLight } from '../rest-service-views/two-way/home-page.view';

@Controller('api/page')
export class PageController {
    private static readonly SUPPORTED_ARTICLE_SEARCH_VALUES: Array<PaginationValue> = [
        { key: 'difficulty', operator: PaginationWhereOperators.EQUALS },
        { key: 'type', operator: PaginationWhereOperators.EQUALS },
        { key: 'isAvailable', operator: PaginationWhereOperators.EQUALS },
        { key: 'isPaid', operator: PaginationWhereOperators.EQUALS }
    ];

    @Get('article/:articleId')
    async getArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        if (!article) {
            res.status(NOT_FOUND).json();
            return;
        }

        const badgeIds = (article.badges || '').split(',');
        res.status(OK).json(ArticlePage.newBuilder()
            .withArticle(ArticleView.newBuilder()
                .withArticleId(article.articleId)
                .withTitle(article.title)
                .withParsedContent(await req.serviceConfig.bbcodeRepository.parseContent(article.content))
                .withContent(article.content)
                .withBadges(badgeIds)
                .withRoom(article.room)
                .withDifficulty(article.difficulty)
                .withType(article.type)
                .withIsApproved(article.isApproved)
                .withIsAvailable(article.isAvailable)
                .withIsPaid(article.isPaid)
                .build())
            .withBadges(await this.getBadges(req.serviceConfig, req.user.userId))
            .withIsCompleted(await req.serviceConfig.habboRepository.isBadgesCompleted(badgeIds, req.user.userId))
            .build());
    }

    @Post('article/:articleId/complete')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async createBadgeComplete (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        if (!article) {
            res.status(NOT_FOUND).json();
            return;
        }

        const entities: Array<BadgeCompleteEntity> = [];
        for (const badgeId of article.badges.split(',')) {
            if (await req.serviceConfig.habboRepository.isBadgeCompleted(req.user.userId, badgeId)) {
                continue;
            }
            entities.push(BadgeCompleteEntity.newBuilder()
                .withBadgeId(badgeId)
                .withUserId(req.user.userId)
                .build());
        }

        await req.serviceConfig.habboRepository.saveBadgeComplete(entities);
        await Logger.createUserLog(req, {
            id: LogTypes.MARKED_BADGE_COMPLETE,
            contentId: article.articleId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: JSON.stringify(entities)
        });
        res.status(OK).json();
    }

    @Get('articles/page/:page')
    async getArticles (req: InternalRequest, res: Response): Promise<void> {
        const data = await req.serviceConfig.articleRepository.paginate({
            take: PaginationHelper.TWENTY_ITEMS,
            page: Number(req.params.page),
            where: RequestUtility.getPaginationWheresFromQuery(req, PageController.SUPPORTED_ARTICLE_SEARCH_VALUES)
                .concat([
                    { key: 'isApproved', operator: PaginationWhereOperators.EQUALS, value: true }
                ]),
            orderBy: {
                sort: 'createdAt',
                order: 'DESC'
            }
        });

        const items = [];
        for (const article of data.getItems()) {
            items.push(await this.getConvertedArticle(req, article));
        }

        res.status(OK)
            .json(PaginationView.newBuilder()
                .withItems(items)
                .withPage(data.getPage())
                .withTotal(data.getTotal()));
    }

    @Get('home')
    async getHomePage (req: InternalRequest, res: Response): Promise<void> {
        const homePageModel = await req.serviceConfig.settingRepository.getKeyValue<HomePageModel>(SettingKey.HOME_PAGE);
        res.status(OK).json(HomePage.newBuilder()
            .withBadges(await this.getBadges(req.serviceConfig, req.user.userId))
            .withGuides(await this.getArticlesFor(req, 4, ArticleConstants.TYPES.GUIDE.value))
            .withHabboNews(await this.getArticlesFor(req, 4, ArticleConstants.TYPES.NEWS.value))
            .withSiteNews(await this.getArticlesFor(req, 4, ArticleConstants.TYPES.SITE_NEWS.value))
            .withTodaysEvents(await this.getNextSlots(req))
            .withStarLight(homePageModel && homePageModel.starLight ? await this.getStarLight(req, homePageModel) : null)
            .withBannerEntries(homePageModel ? this.getBannerEntries(homePageModel) : [])
            .build());
    }

    @Get('staff-list')
    async getStaffList (req: InternalRequest, res: Response): Promise<void> {
        const staffListModel = await req.serviceConfig.settingRepository.getKeyValue<StaffListModel>(SettingKey.STAFF_LIST);
        const entries: Array<StaffListRow> = [];
        for (const entry of (staffListModel ? staffListModel.entries : [])) {
            const group = await req.serviceConfig.groupRepository.getGroupById(entry.groupId);
            const userIds = await req.serviceConfig.userGroupRepository.getUserIdsWithGroup(group.groupId);
            if (userIds.length === 0) {
                continue;
            }
            const users = [];
            for (const userId of userIds) {
                users.push(await req.serviceConfig.userRepository.getSlimUserById(userId));
            }

            entries.push(StaffListRow.newBuilder()
                .withGroupId(entry.groupId)
                .withDisplayOrder(entry.displayOrder)
                .withName(group.name)
                .withNameColor(group.nameColor)
                .withUsers(users)
                .build());
        }

        res.status(OK).json(StaffListPage.newBuilder().withRows(entries).build());
    }

    private getBannerEntries (homePageModel: HomePageModel): Array<HomePageBannerEntry> {
        return (homePageModel.bannerEntries || []).map(entry => HomePageBannerEntry.newBuilder()
            .withId(entry.id)
            .withCaption(entry.caption)
            .build());
    }

    private async getStarLight (req: InternalRequest, homePageModel: HomePageModel): Promise<HomePageStarLight> {
        const user = await req.serviceConfig.userRepository.getSlimUserById(homePageModel.starLight.userId);
        if (!user) {
            return null;
        }
        return HomePageStarLight.newBuilder()
            .withUser(user)
            .withText(homePageModel.starLight.text)
            .build();
    }

    private async getBadges (serviceConfig: ServiceConfig, userId: number): Promise<Array<BadgeView>> {
        const items = await serviceConfig.habboRepository.paginate({
            take: 12,
            page: 1,
            orderBy: { sort: 'createdAt', order: 'DESC' }
        });

        const badges: Array<BadgeView> = [];

        for (const item of items.getItems()) {
            const article = await serviceConfig.articleRepository.getArticleWithBadgeId(item.badgeId);

            badges.push(BadgeView.newBuilder()
                .withHabboBadgeId(item.habboBadgeId)
                .withBadgeId(item.badgeId)
                .withDescription(item.description)
                .withDescription(item.description)
                .withArticleId(article ? article.articleId : null)
                .withIsCompleted(await serviceConfig.habboRepository.isBadgeCompleted(userId, item.badgeId))
                .withCreatedAt(item.createdAt)
                .build());
        }

        return badges;
    }

    private async getNextSlots (req: InternalRequest): Promise<Array<TimetableSlot>> {
        let day = TimeUtility.getCurrentDay();
        let hour = TimeUtility.getCurrentHour();

        const items = await req.serviceConfig.timetableRepository.getSlotsFrom(TimetableType.EVENTS, day, hour);
        const convertedSlots = await TimetableUtility.getConvertedSlots(req, items)
            .then(data => data.filter(slot => slot.getUser() !== null));
        const slots: Array<TimetableSlot> = [];

        while (true) {
            for (const slot of convertedSlots) {
                if (slot.getHour() === hour && slot.getDay() === day) {
                    slots.push(slot);
                    break;
                }
            }

            if (slots.length === 4) {
                break;
            }

            hour++;
            if (hour >= 24) {
                hour = 0;
                day++;
            }

            if (day >= 7) {
                break;
            }
        }

        return slots;
    }

    private async getArticlesFor (req: InternalRequest, amount: number, type: number): Promise<Array<ArticleView>> {
        const paginate = await req.serviceConfig.articleRepository.paginate({
            take: amount,
            page: 1,
            orderBy: { sort: 'createdAt', order: 'DESC' },
            where: [
                { key: 'type', operator: PaginationWhereOperators.EQUALS, value: String(type) },
                { key: 'isApproved', operator: PaginationWhereOperators.EQUALS, value: true }
            ]
        });

        const articles = [];
        for (const article of paginate.getItems()) {
            articles.push(await this.getConvertedArticle(req, article));
        }
        return articles;
    }

    private async getConvertedArticle (req: InternalRequest, article: ArticleEntity): Promise<ArticleView> {
        const user = await req.serviceConfig.userRepository.getSlimUserById(article.userId);
        return ArticleView.newBuilder()
            .withArticleId(article.articleId)
            .withUser(user)
            .withTitle(article.title)
            .withContent(article.content)
            .withBadges((article.badges || '').split(','))
            .withRoom(article.room)
            .withRoomOwner(article.roomOwner)
            .withDifficulty(article.difficulty)
            .withIsAvailable(article.isAvailable)
            .withIsPaid(article.isPaid)
            .withType(article.type)
            .withUpdatedAt(article.updatedAt)
            .build();
    }
}
