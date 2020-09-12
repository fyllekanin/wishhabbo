import { IBackgroundTask } from '../background-task.interface';
import { SettingRepository } from '../../persistance/repositories/setting.repository';
import { RadioSettingsModel } from '../../persistance/entities/settings/models/radio-settings.model';
import { SettingKey } from '../../persistance/entities/settings/setting.entity';
import { RadioStatsModel } from '../../persistance/entities/settings/models/radio-stats.model';
import axios from 'axios';
import xml2js from 'xml2js';
import { UserRepository } from '../../persistance/repositories/user/user.repository';
import { SlimUserView } from '../../rest-service-views/two-way/slim-user.view';
import { TimetableRepository } from '../../persistance/repositories/staff/timetable.repository';
import { TimeUtility } from '../../utilities/time.utility';
import { TimetableType } from '../../persistance/entities/staff/timetable.entity';

export class RadioStatsTask implements IBackgroundTask {

    async run (): Promise<void> {
        const settingRepository = new SettingRepository();
        const userRepository = new UserRepository();
        const timetableRepository = new TimetableRepository();
        const radioSettings = await settingRepository.getKeyValue<RadioSettingsModel>(SettingKey.RADIO_SETTINGS);
        if (!radioSettings) {
            return;
        }

        const radioStats = await settingRepository.getSetting(SettingKey.RADIO_STATS);

        let stats: RadioStatsModel = null;
        if (radioSettings.isAzuraCast) {
            stats = await this.getStatsFromAzuraCast(radioSettings, userRepository, timetableRepository);
        }

        await settingRepository.save(radioStats.newBuilderFromCurrent()
            .withValue(stats)
            .build());
    }

    getSchedule (): string {
        return '*/10 * * * * *';
    }

    private async getStatsFromAzuraCast (radioSettings: RadioSettingsModel, userRepository: UserRepository,
                                         timetableRepository: TimetableRepository): Promise<RadioStatsModel> {
        const data = await axios.get<string>(`${radioSettings.host}/radio/${radioSettings.port}/admin/` +
            `status.xml?mount=${radioSettings.mountPoint}`, {
            auth: {
                username: 'admin',
                password: radioSettings.adminPassword
            }
        }).catch(() => null);
        if (!data) {
            return null;
        }

        const xml = await this.getParsedXml(data.data);
        if (!xml || !xml.icestats) {
            return null;
        }

        const currentDj = await userRepository.getUserWithUsername(xml.icestats.source[0].genre[0]);
        return {
            listeners: this.getListenerCount(xml.icestats.source[0].listener),
            song: xml.icestats.source[0].yp_currently_playing ?
                xml.icestats.source[0].yp_currently_playing[0] : xml.icestats.source[0].artist[0],
            currentDj: currentDj ? SlimUserView.newBuilder()
                .withUserId(currentDj.userId)
                .withUsername(currentDj.username)
                .withLikes(currentDj.likes)
                .withHabbo(currentDj.habbo)
                .withUpdatedAt(currentDj.updatedAt)
                .build() : null,
            nextDj: await this.getNextDj(timetableRepository, userRepository)
        };
    }

    private async getNextDj (timetableRepository: TimetableRepository, userRepository: UserRepository): Promise<SlimUserView> {
        const currentHour = new Date().getUTCHours();
        const currentDay = TimeUtility.getCurrentDay();

        const nextHour = (currentHour + 1) > 23 ? 0 : currentHour + 1;
        const nextDay = currentHour !== nextHour ? ((currentDay + 1) > 7 ? 1 : currentDay + 1) : currentDay;

        const slot = await timetableRepository.getSlotForTime(nextDay, nextHour, TimetableType.RADIO);
        return slot ? await userRepository.getSlimUserById(slot.userId) : null;
    }

    private getListenerCount (listeners: Array<{ IP: string }>): number {
        const uniqueIps: Array<string> = [];
        if (!Array.isArray(listeners)) {
            return 0;
        }
        for (const listener of listeners) {
            if (!uniqueIps.includes(listener.IP)) {
                uniqueIps.push(listener.IP);
            }
        }
        return uniqueIps.length;
    }

    private async getParsedXml (xmlString: string): Promise<any> {
        return new Promise(res => {
            xml2js.parseString(xmlString, (err, result) => {
                if (err === null) {
                    res(result);
                } else {
                    res(null);
                }
            });
        });
    }
}
