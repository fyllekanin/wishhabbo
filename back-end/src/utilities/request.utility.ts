import { Request } from 'express';

export class RequestUtility {
    private static readonly BEARER = 'Bearer';
    private static readonly AUTHORIZATION_HEADER = 'Authorization';
    private static readonly REFRESH_AUTHORIZATION_HEADER = 'RefreshAuthorization';

    static getAccessToken (req: Request): string {
        const header = req.header(RequestUtility.AUTHORIZATION_HEADER);
        if (!header || header.length < 1) {
            return null;
        }
        if (header.split(' ')[0] !== RequestUtility.BEARER) {
            return null;
        }
        return header.split(' ')[1];
    }

    static getRefreshToken (req: Request): string {
        const header = req.header(RequestUtility.REFRESH_AUTHORIZATION_HEADER);
        return header ? header : null;
    }
}
