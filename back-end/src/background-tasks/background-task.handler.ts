import { BadgeScannerTask } from './tasks/badge-scanner.task';
import { TokenCleanupTask } from './tasks/token-cleanup.task';
import cron from 'node-cron';
import { TimetableCleanupTask } from './tasks/timetable-cleanup.task';
import { RadioStatsTask } from './tasks/radio-stats.task';

export class BackgroundTaskHandler {
    private static readonly TASKS = [
        new BadgeScannerTask(),
        new TokenCleanupTask(),
        new TimetableCleanupTask(),
        new RadioStatsTask()
    ];

    activate (): void {
        BackgroundTaskHandler.TASKS
            .filter(task => {
                if (!cron.validate(task.getSchedule())) {
                    console.log(`${task.constructor.name} does not have a valid schedule`);
                    return false;
                }
                return true;
            })
            .forEach(task => cron.schedule(task.getSchedule(), task.run.bind(task)));
    }
}
