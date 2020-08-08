import { IBackgroundTask } from '../background-task.interface';
import { TokenRepository } from '../../persistance/repositories/user/token.repository';

export class TokenCleanupTask implements IBackgroundTask {

    async run (): Promise<void> {
        const tokenRepository = new TokenRepository();
        const result = await tokenRepository.deleteExpiredTokens();
        console.log(`Deleted ${result.affected} expired tokens`);
    }

    getSchedule (): string {
        return '0 * * * *';
    }
}
