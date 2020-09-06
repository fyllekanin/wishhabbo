import { IPayload } from '../../payload.interface';
import { InternalRequest } from '../../../../utilities/internal.request';

export class UserDetailsPayload implements IPayload {
    private readonly username: string;
    private readonly habbo: string;
    private readonly password: string;
    private readonly repassword: string;

    constructor (
        username: string,
        habbo: string,
        password: string,
        repassword: string
    ) {
        this.username = username;
        this.habbo = habbo;
        this.password = password;
        this.repassword = repassword;
    }

    getUsername (): string {
        return this.username;
    }

    getHabbo (): string {
        return this.habbo;
    }

    getPassword (): string {
        return this.password;
    }

    getRepassword (): string {
        return this.repassword;
    }

    static of (req: InternalRequest): UserDetailsPayload {
        return new UserDetailsPayload(
            req.body.username,
            req.body.habbo,
            req.body.password,
            req.body.repassword
        );
    }
}
