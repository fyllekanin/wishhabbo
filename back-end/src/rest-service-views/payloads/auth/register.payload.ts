import { Request } from 'express';
import { IPayload } from '../payload.interface';

export class RegisterPayload implements IPayload {
    private readonly username: string;
    private readonly password: string;
    private readonly repassword: string;
    private readonly habbo: string;

    constructor (
        username: string, password: string, repassword: string, habbo: string
    ) {
        this.username = username;
        this.password = password;
        this.repassword = repassword;
        this.habbo = habbo;
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

    getHabbo (): string {
        return this.habbo;
    }

    static of (req: Request): RegisterPayload {
        const { username, password, repassword, habbo } = req.body;
        return new RegisterPayload(username, password, repassword, habbo);
    }
}
