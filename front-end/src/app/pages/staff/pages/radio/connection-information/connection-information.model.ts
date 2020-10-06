import { ClassHelper, primitiveOf } from '../../../../../shared/helpers/class.helper';
import { ServerTypeLabel } from '../../../../../shared/classes/radio-settings.class';

export class ConnectionInformationPage {
    @primitiveOf(String)
    serverType: string;
    @primitiveOf(String)
    host: string;
    @primitiveOf(Number)
    port: number;
    @primitiveOf(String)
    password: string;
    @primitiveOf(String)
    mountPoint: string;
    @primitiveOf(Boolean)
    canSeeInformation: boolean;

    constructor (source: Partial<ConnectionInformationPage>) {
        ClassHelper.assign(this, source);
        this.serverType = ServerTypeLabel.of(this.serverType);
    }
}
