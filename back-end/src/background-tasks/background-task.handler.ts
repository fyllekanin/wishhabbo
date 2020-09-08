import { BadgeScannerTasks } from './tasks/badge-scanner.tasks';
import { TokenCleanupTask } from './tasks/token-cleanup.task';
import cron from 'node-cron';
import { TimetableCleanupTask } from './tasks/timetable-cleanup.task';

export class BackgroundTaskHandler {
    private static readonly TASKS = [
        new BadgeScannerTasks(),
        new TokenCleanupTask(),
        new TimetableCleanupTask()
    ];

    activate (): void {
        BackgroundTaskHandler.TASKS
            .filter(task => cron.validate(task.getSchedule()))
            .forEach(task => cron.schedule(task.getSchedule(), task.run.bind(task)));
    }
}
