import { IBackgroundTask } from '../background-task.interface';
import { HabboRepository } from '../../persistance/repositories/habbo.repository';
import { HabboService } from '../../external/services/habbo.service';
import { HabboBadgeEntity } from '../../persistance/entities/habbo/habbo-badge.entity';

export class BadgeScannerTasks implements IBackgroundTask {
    private static readonly FIRST_PATTERN = /_badge_desc/;
    private static readonly SECOND_PATTERN = /badge_desc_/;
    private static readonly THIRD_PATTERN = /badge_name_/;


    async run (): Promise<void> {
        const habboRepository = new HabboRepository();
        const habboService = new HabboService();

        const gamedata = await habboService.getGamedata();
        const items = gamedata.split('\n');
        const entities = [];

        for (const item of items) {
            const badge = this.getBadge(item);
            if (!badge || await habboRepository.doBadgeIdExist(badge.badgeId)) {
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
        if (item.match(BadgeScannerTasks.FIRST_PATTERN)) {
            const parts = item.split('_badge_desc=');
            return { badgeId: parts[0], description: parts[1] };
        } else if (item.match(BadgeScannerTasks.SECOND_PATTERN)) {
            const parts = item.split('=');
            return { badgeId: parts[0].replace('badge_desc_', ''), description: parts[1] };
        } else if (item.match(BadgeScannerTasks.THIRD_PATTERN)) {
            const parts = item.split('=');
            return { badgeId: parts[0].replace('badge_name_', ''), description: parts[1] };
        }
        return null;
    }
}
