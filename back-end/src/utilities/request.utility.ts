import { Request } from 'express';

export class RequestUtility {
    private static readonly AUTHORIZATION_HEADER = 'Authorization';

    static getAccessToken (req: Request): string {
        const header = req.header(RequestUtility.AUTHORIZATION_HEADER);
        if (!header || header.length < 1) {
            return null;
        }
        return header.split(' ')[1];
    }
}
