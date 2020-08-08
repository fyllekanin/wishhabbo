import { HabboBadge, HabboUser } from '../views/habbo.view';
import axios from 'axios';

export class HabboService {
    private static readonly COOKIE = 'browser_token=thisisabrowsertoken;session.id=thisisasessionid;';
    private static readonly HOST = 'http://www.habbo.com';
    private static readonly API_END_POINT = `${HabboService.HOST}/api/public`;

    async getGamedata (): Promise<string> {
        const data = await axios.get(`${HabboService.HOST}/gamedata/external_flash_texts/1`, {
            headers: {
                Cookie: HabboService.COOKIE,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' +
                    '(KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
            }
        }).catch(() => null);
        if (!data || !data.data) {
            return null;
        }
        return data.data;
    }

    async getHabbo (name: string): Promise<HabboUser> {
        const data = await axios.get(`${HabboService.API_END_POINT}/users?name=${name}`, {
            headers: {
                Cookie: HabboService.COOKIE,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' +
                    '(KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
            }
        }).catch(() => null);
        if (!data || !data.data) {
            return null;
        }
        const habbo = data.data;
        const badges = habbo.selectedBadges.map((selectedBadge: any) => HabboBadge.newBuilder()
            .withBadgeIndex(selectedBadge.badgeIndex)
            .withCode(selectedBadge.code)
            .withDescription(selectedBadge.description)
            .withName(selectedBadge.name)
            .build());

        return HabboUser.newBuilder()
            .withName(habbo.name)
            .withFigureString(habbo.figureString)
            .withMemberSince(habbo.memberSince)
            .withMotto(habbo.motto)
            .withProfileVisible(habbo.profileVisible)
            .withUniqueId(habbo.uniqueId)
            .withSelectedBadges(badges)
            .build();
    }
}
