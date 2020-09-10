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
            .filter(task => cron.validate(task.getSchedule()))
            .forEach(task => cron.schedule(task.getSchedule(), task.run.bind(task)));
    }
}
