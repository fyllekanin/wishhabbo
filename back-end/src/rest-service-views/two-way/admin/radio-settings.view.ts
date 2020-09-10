import { InternalRequest } from '../../../utilities/internal.request';
import { IPayload } from '../../payloads/payload.interface';

export enum ServerType {
    SHOUTCAST_V1 = 'SHOUTCAST_V1',
    SHOUTCAST_V2 = 'SHOUTCAST_V2',
    ICECAST_V2 = 'ICECAST_V2'
}

export class RadioSettingsView implements IPayload {
    private readonly host: string;
    private readonly port: number;
    private readonly password: string;
    private readonly adminPassword: string;
    private readonly mountPoint: string;
    private readonly serverType: ServerType;
    private readonly isAzuraCast: boolean;

    constructor (builder: Builder) {
        this.host = builder.host;
        this.port = builder.port;
        this.password = builder.password;
        this.adminPassword = builder.adminPassword;
        this.mountPoint = builder.mountPoint;
        this.serverType = builder.serverType;
        this.isAzuraCast = builder.isAzuraCast;
    }

    getHost (): string {
        return this.host;
    }

    getPort (): number {
        return this.port;
    }

    getPassword (): string {
        return this.password;
    }

    getAdminPassword (): string {
        return this.adminPassword;
    }

    getMountPoint (): string {
        return this.mountPoint;
    }

    getServerType (): ServerType {
        return this.serverType;
    }

    getIsAzuraCast (): boolean {
        return this.isAzuraCast;
    }

    static of (req: InternalRequest): RadioSettingsView {
        return this.newBuilder()
            .withHost(req.body.host)
            .withPort(req.body.port)
            .withPassword(req.body.password)
            .withAdminPassword(req.body.adminPassword)
            .withMountPoint(req.body.mountPoint)
            .withServerType(req.body.serverType)
            .withIsAzuraCast(req.body.isAzuraCast)
            .build();
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    host: string;
    port: number;
    password: string;
    adminPassword: string;
    mountPoint: string;
    serverType: ServerType;
    isAzuraCast: boolean;

    withHost (host: string): Builder {
        this.host = host;
        return this;
    }

    withPort (port: number): Builder {
        this.port = port;
        return this;
    }

    withPassword (password: string): Builder {
        this.password = password;
        return this;
    }

    withAdminPassword (adminPassword: string): Builder {
        this.adminPassword = adminPassword;
        return this;
    }

    withMountPoint (mountPoint: string): Builder {
        this.mountPoint = mountPoint;
        return this;
    }

    withServerType (serverType: ServerType): Builder {
        this.serverType = serverType;
        return this;
    }

    withIsAzuraCast (isAzuraCast: boolean): Builder {
        this.isAzuraCast = isAzuraCast;
        return this;
    }

    build (): RadioSettingsView {
        return new RadioSettingsView(this);
    }
}
