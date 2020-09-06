import { IPayload } from '../../payload.interface';
import { InternalRequest } from '../../../../utilities/internal.request';

export class UserDetailsPayload implements IPayload {
    private readonly userId: number;
    private readonly username: string;
    private readonly habbo: string;
    private readonly password: string;
    private readonly repassword: string;

    constructor (
        userId: number,
        username: string,
        habbo: string,
        password: string,
        repassword: string
    ) {
        this.userId = userId;
        this.username = username;
        this.habbo = habbo;
        this.password = password;
        this.repassword = repassword;
    }

    getUserId (): number {
        return this.userId;
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
            req.body.userId,
            req.body.username,
            req.body.habbo,
            req.body.password,
            req.body.repassword
        );
    }
}
