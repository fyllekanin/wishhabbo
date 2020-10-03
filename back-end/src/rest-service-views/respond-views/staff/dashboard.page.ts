export class DashboardPage {
    private readonly radioSlotCount: number;
    private readonly eventSlotCount: number;
    private readonly articleCount: number;

    constructor (builder: Builder) {
        this.radioSlotCount = builder.radioSlotCount;
        this.eventSlotCount = builder.eventSlotCount;
        this.articleCount = builder.articleCount;
    }

    getRadioSlotCount (): number {
        return this.radioSlotCount;
    }

    getEventSlotCount (): number {
        return this.eventSlotCount;
    }

    getArticleCount (): number {
        return this.articleCount;
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    radioSlotCount: number;
    eventSlotCount: number;
    articleCount: number;

    withRadioSlotcount (radioSlotCount: number): Builder {
        this.radioSlotCount = radioSlotCount;
        return this;
    }

    withEventSlotCount (eventSlotCount: number): Builder {
        this.eventSlotCount = eventSlotCount;
        return this;
    }

    withArticleCount (articleCount: number): Builder {
        this.articleCount = articleCount;
        return this;
    }

    build (): DashboardPage {
        return new DashboardPage(this);
    }
}
