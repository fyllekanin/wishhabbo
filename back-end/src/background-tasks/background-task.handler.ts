import { BadgeScannerTasks } from './tasks/badge-scanner.tasks';
import { TokenCleanupTask } from './tasks/token-cleanup.task';
import cron from 'node-cron';

export class BackgroundTaskHandler {
    private static readonly TASKS = [
        new BadgeScannerTasks(),
        new TokenCleanupTask()
    ];

    activate (): void {
        BackgroundTaskHandler.TASKS
            .filter(task => cron.validate(task.getSchedule()))
            .forEach(task => cron.schedule(task.getSchedule(), task.run.bind(task)));
    }
}
