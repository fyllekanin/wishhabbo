import { IPayload } from '../payload.interface';

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

    static of (data: any): LoginPayload {
        const { username, password } = data;
        return new LoginPayload(username, password);
    }
}
