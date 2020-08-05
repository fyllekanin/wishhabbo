import { AuthUserView } from './auth-user.view';

export class InitialView {
    private readonly authUser: AuthUserView;

    constructor (builder: InitialViewBuilder) {
        this.authUser = builder.authUser;
    }

    getAuthUser (): AuthUserView {
        return this.authUser;
    }

    static newBuilder (): InitialViewBuilder {
        return new InitialViewBuilder();
    }
}

class InitialViewBuilder {
    authUser: AuthUserView;

    withAuthUser (authUser: AuthUserView): InitialViewBuilder {
        this.authUser = authUser;
        return this;
    }

    build (): InitialView {
        return new InitialView(this);
    }
}
