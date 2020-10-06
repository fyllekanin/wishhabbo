import { ServerType } from '../../../two-way/admin/radio-settings.view';

export class ConnectionInformationPage {
    private readonly serverType: ServerType;
    private readonly host: string;
    private readonly port: number;
    private readonly password: string;
    private readonly mountPoint: string;
    private readonly canSeeInformation: boolean;

    constructor (builder: Builder) {
        this.serverType = builder.serverType;
        this.host = builder.host;
        this.port = builder.port;
        this.password = builder.password;
        this.mountPoint = builder.mountPoint;
        this.canSeeInformation = builder.canSeeInformation;
    }

    getServerType (): ServerType {
        return this.serverType;
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

    getMountPoint (): string {
        return this.mountPoint;
    }

    getCanSeeInformation (): boolean {
        return this.canSeeInformation;
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    serverType: ServerType;
    host: string;
    port: number;
    password: string;
    mountPoint: string;
    canSeeInformation: boolean;

    withServerType (serverType: ServerType): Builder {
        this.serverType = serverType;
        return this;
    }

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

    withMountPoint (mountPoint: string): Builder {
        this.mountPoint = mountPoint;
        return this;
    }

    withCanSeeInformation (canSeeInformation: boolean): Builder {
        this.canSeeInformation = canSeeInformation;
        return this;
    }

    build (): ConnectionInformationPage {
        return new ConnectionInformationPage(this);
    }
}
