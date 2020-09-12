import { RadioStatsModel } from '../../persistance/entities/settings/models/radio-stats.model';

export class ContinuesInformationView {
    private readonly radioStats: RadioStatsModel;

    constructor (builder: Builder) {
        this.radioStats = builder.radioStats;
    }

    getRadioStats (): RadioStatsModel {
        return this.radioStats;
    }

    static newBuilder<T> (): Builder {
        return new Builder();
    }
}

class Builder {
    radioStats: RadioStatsModel;

    withRadioStats (radioStats: RadioStatsModel): Builder {
        this.radioStats = radioStats;
        return this;
    }

    build (): ContinuesInformationView {
        return new ContinuesInformationView(this);
    }
}
