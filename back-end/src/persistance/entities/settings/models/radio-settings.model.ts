import { ServerType } from '../../../../rest-service-views/two-way/admin/radio-settings.view';

export interface RadioSettingsModel {
    host: string;
    port: number;
    password: string;
    adminPassword: string;
    mountPoint: string;
    serverType: ServerType;
    isAzuraCast: boolean;
}
