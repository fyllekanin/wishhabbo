import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
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

@Controller('api/page')
export class PageController {

    @Get('article/:articleId')
    private async getArticle (req: InternalRequest, res: Response): Promise<void> {
        const article = await req.serviceConfig.articleRepository.getByArticleId(Number(req.params.articleId));
        if (!article) {
            res.status(NOT_FOUND).json();
            return;
        }

        res.status(OK).json(ArticleView.newBuilder()
            .withArticleId(article.articleId)
            .withTitle(article.title)
            .withParsedContent(await req.serviceConfig.bbcodeRepository.parseContent(article.content))
            .withContent(article.content)
            .withBadges(JSON.parse(article.badges))
            .withRoom(article.room)
            .withDifficulty(article.difficulty)
            .withType(article.type)
            .withIsApproved(article.isApproved)
            .withIsAvailable(article.isAvailable)
            .withIsPaid(article.isPaid)
            .build());
    }

    @Get('home')
    private async getHomePage (req: InternalRequest, res: Response): Promise<void> {
        const badges = await req.serviceConfig.habboRepository.paginate({
            take: 12,
            page: 1,
            orderBy: { sort: 'createdAt', order: 'DESC' }
        });

        res.status(OK).json(HomePage.newBuilder()
            .withBadges(badges.getItems())
            .withGuides(await this.getArticles(req, 4, ArticleConstants.TYPES.GUIDE.value))
            .withHabboNews(await this.getArticles(req, 4, ArticleConstants.TYPES.NEWS.value))
            .withSiteNews(await this.getArticles(req, 4, ArticleConstants.TYPES.SITE_NEWS.value))
            .withTodaysEvents(await this.getNextSlots(req))
            .build());
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

    private async getArticles (req: InternalRequest, amount: number, type: number): Promise<Array<ArticleView>> {
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
            const user = await req.serviceConfig.userRepository.getSlimUserById(article.userId);
            articles.push(ArticleView.newBuilder()
                .withArticleId(article.articleId)
                .withUser(user)
                .withTitle(article.title)
                .withContent(article.content)
                .withBadges(JSON.parse(article.badges))
                .withRoom(article.room)
                .withRoomOwner(article.roomOwner)
                .withDifficulty(article.difficulty)
                .withIsAvailable(article.isAvailable)
                .withIsPaid(article.isPaid)
                .withType(type)
                .withUpdatedAt(article.updatedAt)
                .build());
        }
        return articles;
    }

    @Get('staff-list')
    private async getStaffList (req: InternalRequest, res: Response): Promise<void> {
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
}
