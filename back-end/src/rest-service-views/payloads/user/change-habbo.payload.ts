import { IPayload } from '../payload.interface';
import { InternalRequest } from '../../../utilities/internal.request';

export class ChangeHabboPayload implements IPayload {
    private readonly habbo: string;

    constructor (
        habbo: string
    ) {
        this.habbo = habbo;
    }

    getHabbo (): string {
        return this.habbo;
    }

    static of (req: InternalRequest): ChangeHabboPayload {
        return new ChangeHabboPayload(
            req.body.habbo
        );
    }
}
