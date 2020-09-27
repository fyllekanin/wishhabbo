import { SlimUserView } from '../../../two-way/slim-user.view';

export class RadioRequestView {
    radioRequestId: number;
    user: SlimUserView;
    request: string;
    createdAt: number;

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    radioRequestId: number;
    user: SlimUserView;
    request: string;
    createdAt: number;

    withRadioRequestId (radioRequestId: number): Builder {
        this.radioRequestId = radioRequestId;
        return this;
    }

    withUser (user: SlimUserView): Builder {
        this.user = user;
        return this;
    }

    withRequest (request: string): Builder {
        this.request = request;
        return this;
    }

    withCreatedAt(createdAt: number): Builder {
        this.createdAt = createdAt;
        return this;
    }

    build (): RadioRequestView {
        const entity = new RadioRequestView();
        entity.radioRequestId = this.radioRequestId;
        entity.user = this.user;
        entity.request = this.request;
        entity.createdAt = this.createdAt;
        return entity;
    }
}
