import { ClassHelper, dateAndTime, objectOf } from './../../../../../shared/helpers/class.helper';
import { primitiveOf } from '../../../../../shared/helpers/class.helper';
import { SlimUser } from './../../../../../shared/classes/slim-user.class';

export class RadioRequest {
    @primitiveOf(Number)
    radioRequestId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitiveOf(String)
    request: string;
    @dateAndTime()
    createdAt: string;

    constructor(source: Partial<RadioRequest>) {
        ClassHelper.assign(this, source);
    }
}
