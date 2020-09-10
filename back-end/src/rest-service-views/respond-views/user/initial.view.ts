import { AuthUserView } from './auth-user.view';
import { RadioSettingsView } from '../../two-way/admin/radio-settings.view';

export class InitialView {
    private readonly authUser: AuthUserView;
    private readonly radioSettings: RadioSettingsView;

    constructor (builder: Builder) {
        this.authUser = builder.authUser;
        this.radioSettings = builder.radioSettings;
    }

    getAuthUser (): AuthUserView {
        return this.authUser;
    }

    getRadioSettings (): RadioSettingsView {
        return this.radioSettings;
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    authUser: AuthUserView;
    radioSettings: RadioSettingsView;

    withAuthUser (authUser: AuthUserView): Builder {
        this.authUser = authUser;
        return this;
    }

    withRadioSettings (radioSettings: RadioSettingsView): Builder {
        this.radioSettings = radioSettings;
        return this;
    }

    build (): InitialView {
        return new InitialView(this);
    }
}
