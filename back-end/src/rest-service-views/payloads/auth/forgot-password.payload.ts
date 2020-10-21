import { IPayload } from '../payload.interface';
import { InternalRequest } from '../../../utilities/internal.request';

export class ForgotPasswordPayload implements IPayload {
    private readonly username: string;
    private readonly password: string;
    private readonly repassword: string;

    constructor (
        username: string, password: string, repassword: string
    ) {
        this.username = username;
        this.password = password;
        this.repassword = repassword;
    }

    getUsername (): string {
        return this.username;
    }

    getPassword (): string {
        return this.password;
    }

    getRepassword (): string {
        return this.repassword;
    }

    static of (req: InternalRequest): ForgotPasswordPayload {
        const { username, password, repassword } = req.body;
        return new ForgotPasswordPayload(username, password, repassword);
    }
}
