import { IBackgroundTask } from '../background-task.interface';
import { HabboRepository } from '../../persistance/repositories/habbo.repository';
import { HabboService } from '../../external/services/habbo.service';
import { HabboBadgeEntity } from '../../persistance/entities/habbo/habbo-badge.entity';

export class BadgeScannerTask implements IBackgroundTask {
    private static readonly FIRST_PATTERN = /_badge_desc/;
    private static readonly SECOND_PATTERN = /badge_desc_/;
    private static readonly THIRD_PATTERN = /badge_name_/;

    async run (): Promise<void> {
        const habboRepository = new HabboRepository();
        const habboService = new HabboService();

        const gamedata = await habboService.getGamedata();
        const items = gamedata.split('\n');
        const entities: Array<HabboBadgeEntity> = [];

        for (const item of items) {
            const badge = this.getBadge(item);
            if (!badge || await habboRepository.doBadgeIdExist(badge.badgeId) ||
                entities.some(i => i.badgeId.toLowerCase() === badge.badgeId.toLowerCase())) {
                continue;
            }

            const entity = HabboBadgeEntity.newBuilder()
                .withBadgeId(badge.badgeId)
                .withDescription(badge.description)
                .build();
            entities.push(entity);
        }
        await habboRepository.saveAll(entities);
        console.log(`Found ${entities.length} new badges on habbo`);
    }

    getSchedule (): string {
        return '0 * * * *';
    }

    private getBadge (item: string): { badgeId: string, description: string } {
        if (item.match(BadgeScannerTask.FIRST_PATTERN)) {
            const parts = item.split('_badge_desc=');
            return { badgeId: parts[0].trim(), description: parts[1].trim() };
        } else if (item.match(BadgeScannerTask.SECOND_PATTERN)) {
            const parts = item.split('=');
            return { badgeId: parts[0].replace('badge_desc_', '').trim(), description: parts[1].trim() };
        } else if (item.match(BadgeScannerTask.THIRD_PATTERN)) {
            const parts = item.split('=');
            return { badgeId: parts[0].replace('badge_name_', '').trim(), description: parts[1].trim() };
        }
        return null;
    }
}
