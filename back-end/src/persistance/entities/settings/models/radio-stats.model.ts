import { UserEntity } from '../../user/user.entity';

export interface RadioStatsModel {
    listeners: number;
    likes: number;
    song: string;
    currentDj: UserEntity;
    nextDj: UserEntity;
}
