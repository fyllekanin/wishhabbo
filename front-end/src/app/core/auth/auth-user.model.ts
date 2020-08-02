import { ClassHelper, primitiveOf } from '../../shared/helpers/class.helper';

export class AuthUser {
    @primitiveOf(Number)
    userId: number;
    @primitiveOf(String)
    username: string;
    @primitiveOf(String)
    habbo: string;
    @primitiveOf(String)
    accessToken: string;
    @primitiveOf(String)
    refreshToken: string;

    constructor (source: Partial<AuthUser>) {
        ClassHelper.assign(this, source);
    }
}
