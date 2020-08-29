import { IPayload } from '../payload.interface';
import { InternalRequest } from '../../../utilities/internal.request';

export class LoginPayload implements IPayload {
    private readonly username: string;
    private readonly password: string;

    constructor (
        username: string, password: string
    ) {
        this.username = username;
        this.password = password;
    }

    getUsername (): string {
        return this.username;
    }

    getPassword (): string {
        return this.password;
    }

    static of (req: InternalRequest): LoginPayload {
        const { username, password } = req.body;
        return new LoginPayload(username, password);
    }
}
