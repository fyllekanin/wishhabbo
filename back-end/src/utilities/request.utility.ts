import { InternalRequest } from './internal.request';
import { PaginationWhere } from '../persistance/repositories/base.repository';

export interface PaginationValue {
    key: string;
    operator: string;
}

export class RequestUtility {
    private static readonly BEARER = 'Bearer';
    private static readonly AUTHORIZATION_HEADER = 'Authorization';
    private static readonly REFRESH_AUTHORIZATION_HEADER = 'RefreshAuthorization';

    static getAccessToken (req: InternalRequest): string {
        const header = req.header(RequestUtility.AUTHORIZATION_HEADER);
        if (!header || header.length < 1) {
            return null;
        }
        if (header.split(' ')[0] !== RequestUtility.BEARER) {
            return null;
        }
        return header.split(' ')[1];
    }

    static getPaginationWheresFromQuery (req: InternalRequest, values: Array<PaginationValue>): Array<PaginationWhere> {
        const isExactSearch = req.query.isExactSearch;
        return values.map(value => {
            const queryValue = req.query[value.key];
            if (!queryValue) {
                return null;
            }
            return <PaginationWhere>{
                key: value.key,
                operator: value.operator,
                value: isExactSearch === 'true' ? queryValue : `%${queryValue}%`
            };
        })
            .filter(value => value);
    }

    static getRefreshToken (req: InternalRequest): string {
        const header = req.header(RequestUtility.REFRESH_AUTHORIZATION_HEADER);
        return header ? header : null;
    }
}
