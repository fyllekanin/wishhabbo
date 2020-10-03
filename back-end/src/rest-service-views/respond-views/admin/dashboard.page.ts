export class DashboardPage {
    private readonly eventSlotCount: number;
    private readonly radioSlotCount: number;
    private readonly staffCount: number;
    private readonly userCount: number;

    constructor (builder: Builder) {
        this.eventSlotCount = builder.eventSlotCount;
        this.radioSlotCount = builder.radioSlotCount;
        this.staffCount = builder.staffCount;
        this.userCount = builder.userCount;
    }

    getEventSlotCount (): number {
        return this.eventSlotCount;
    }

    getRadioSlotCount (): number {
        return this.radioSlotCount;
    }

    getStaffCount (): number {
        return this.staffCount;
    }

    getUserCount (): number {
        return this.userCount;
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    eventSlotCount: number;
    radioSlotCount: number;
    staffCount: number;
    userCount: number;

    withEventSlotCount (eventSlotCount: number): Builder {
        this.eventSlotCount = eventSlotCount;
        return this;
    }

    withRadioSlotCount (radioSlotCount: number): Builder {
        this.radioSlotCount = radioSlotCount;
        return this;
    }

    withStaffCount (staffCount: number): Builder {
        this.staffCount = staffCount;
        return this;
    }

    withUserCount (userCount: number): Builder {
        this.userCount = userCount;
        return this;
    }

    build (): DashboardPage {
        return new DashboardPage(this);
    }
}
