import { IBackgroundTask } from '../background-task.interface';
import { TimetableRepository } from '../../persistance/repositories/staff/timetable.repository';
import { TimeUtility } from '../../utilities/time.utility';

export class TimetableCleanupTask implements IBackgroundTask {

    async run (): Promise<void> {
        const currentDay = TimeUtility.getCurrentDay();
        const timetableRepository = new TimetableRepository();

        switch (currentDay) {
            case 6:
                await timetableRepository.doArchiveWeekSlots();
                break;
            case 1:
                await timetableRepository.doArchiveWeekendSlots();
                break;
        }


    }

    getSchedule (): string {
        return '0 7 * * *';
    }
}
