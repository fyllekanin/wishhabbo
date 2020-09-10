import { IBackgroundTask } from '../background-task.interface';
import { SettingRepository } from '../../persistance/repositories/setting.repository';
import { RadioSettingsModel } from '../../persistance/entities/settings/models/radio-settings.model';
import { SettingKey } from '../../persistance/entities/settings/setting.entity';
import { RadioStatsModel } from '../../persistance/entities/settings/models/radio-stats.model';
import axios from 'axios';
import xml2js from 'xml2js';
import { UserRepository } from '../../persistance/repositories/user/user.repository';

export class RadioStatsTask implements IBackgroundTask {

    async run (): Promise<void> {
        const settingRepository = new SettingRepository();
        const userRepository = new UserRepository();
        const radioSettings = await settingRepository.getKeyValue<RadioSettingsModel>(SettingKey.RADIO_SETTINGS);
        const radioStats = await settingRepository.getSetting(SettingKey.RADIO_STATS);

        let stats: RadioStatsModel = null;
        if (radioSettings.isAzuraCast) {
            stats = await this.getStatsFromAzuraCast(radioSettings, userRepository);
        }

        await settingRepository.save(radioStats.newBuilderFromCurrent()
            .withValue(stats)
            .build());
    }

    getSchedule (): string {
        return '*/10 * * * * *';
    }

    private async getStatsFromAzuraCast (radioSettings: RadioSettingsModel, userRepository: UserRepository): Promise<RadioStatsModel> {
        const data = await axios.get<string>(`${radioSettings.host}/radio/${radioSettings.port}/admin/` +
            `status.xml?mount=${radioSettings.mountPoint}`, {
            auth: {
                username: 'admin',
                password: radioSettings.adminPassword
            }
        }).catch((reason) => {
            // empty
        });
        if (!data) {
            return null;
        }

        const xml = await this.getParsedXml(data.data);
        if (!xml) {
            return null;
        }

        return {
            listeners: this.getListenerCount(xml.icestats.source[0].listener),
            likes: 0,
            song: xml.icestats.source[0].title[0],
            currentDj: await userRepository.getUserWithUsername(xml.icestats.source[0].genre[0]),
            nextDj: null
        };
    }

    private getListenerCount (listeners: Array<{ IP: string }>): number {
        const uniqueIps: Array<string> = [];
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
