import { SlimUserView } from '../../../../rest-service-views/two-way/slim-user.view';

export interface RadioStatsModel {
    listeners: number;
    song: string;
    currentDj: SlimUserView;
    nextDj: SlimUserView;
}
