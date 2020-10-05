import { IPayload } from '../payload.interface';
import { InternalRequest } from '../../../utilities/internal.request';

export class ChangePasswordPayload implements IPayload {
    private readonly password: string;
    private readonly repassword: string;
    private readonly shouldDeleteTokens: boolean;

    constructor (
        password: string,
        repassword: string,
        shouldDeleteTokens: boolean
    ) {
        this.password = password;
        this.repassword = repassword;
        this.shouldDeleteTokens = shouldDeleteTokens;
    }

    getPassword (): string {
        return this.password;
    }

    getRepassword (): string {
        return this.repassword;
    }

    getShouldDeleteTokens (): boolean {
        return this.shouldDeleteTokens;
    }

    static of (req: InternalRequest): ChangePasswordPayload {
        return new ChangePasswordPayload(
            req.body.password,
            req.body.repassword,
            req.body.shouldDeleteTokens
        );
    }
}
