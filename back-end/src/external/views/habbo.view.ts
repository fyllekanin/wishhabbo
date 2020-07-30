export class HabboBadge {
    private readonly badgeIndex: number;
    private readonly code: string;
    private readonly name: string;
    private readonly description: string;

    constructor (builder: HabboBadgeBuilder) {
        this.badgeIndex = builder.badgeIndex;
        this.code = builder.code;
        this.name = builder.name;
        this.description = builder.description;
    }

    getBadgeIndex (): number {
        return this.badgeIndex;
    }

    getCode (): string {
        return this.code;
    }

    getName (): string {
        return this.name;
    }

    getDescription (): string {
        return this.description;
    }

    static newBuilder (): HabboBadgeBuilder {
        return new HabboBadgeBuilder();
    }
}

class HabboBadgeBuilder {
    badgeIndex: number;
    code: string;
    name: string;
    description: string;

    withBadgeIndex (badgeIndex: number): HabboBadgeBuilder {
        this.badgeIndex = badgeIndex;
        return this;
    }

    withCode (code: string): HabboBadgeBuilder {
        this.code = code;
        return this;
    }

    withName (name: string): HabboBadgeBuilder {
        this.name = name;
        return this;
    }

    withDescription (description: string): HabboBadgeBuilder {
        this.description = description;
        return this;
    }

    build (): HabboBadge {
        return new HabboBadge(this);
    }
}

export class HabboUser {
    private readonly uniqueId: string;
    private readonly name: string;
    private readonly figureString: string;
    private readonly motto: string;
    private readonly memberSince: string;
    private readonly profileVisible: boolean;
    private readonly selectedBadges: Array<HabboBadge>;

    constructor (builder: HabboUserBuilder) {
        this.uniqueId = builder.uniqueId;
        this.name = builder.name;
        this.figureString = builder.figureString;
        this.motto = builder.motto;
        this.memberSince = builder.memberSince;
        this.profileVisible = builder.profileVisible;
        this.selectedBadges = [ ...builder.selectedBadges ];
    }

    getUniqueId (): string {
        return this.uniqueId;
    }

    getName (): string {
        return this.name;
    }

    getFigureString (): string {
        return this.figureString;
    }

    getMotto (): string {
        return this.motto;
    }

    getMemberSince (): string {
        return this.memberSince;
    }

    getProfileVisible (): boolean {
        return this.profileVisible;
    }

    getSelectedBadges (): Array<HabboBadge> {
        return [ ...this.selectedBadges ];
    }

    static newBuilder (): HabboUserBuilder {
        return new HabboUserBuilder();
    }
}

class HabboUserBuilder {
    uniqueId: string;
    name: string;
    figureString: string;
    motto: string;
    memberSince: string;
    profileVisible: boolean;
    selectedBadges: Array<HabboBadge>;

    withUniqueId (uniqueId: string): HabboUserBuilder {
        this.uniqueId = uniqueId;
        return this;
    }

    withName (name: string): HabboUserBuilder {
        this.name = name;
        return this;
    }

    withFigureString (figureString: string): HabboUserBuilder {
        this.figureString = figureString;
        return this;
    }

    withMotto (motto: string): HabboUserBuilder {
        this.motto = motto;
        return this;
    }

    withMemberSince (memberSince: string): HabboUserBuilder {
        this.memberSince = memberSince;
        return this;
    }

    withProfileVisible (profileVisible: boolean): HabboUserBuilder {
        this.profileVisible = profileVisible;
        return this;
    }

    withSelectedBadges (selectedBadges: Array<HabboBadge>): HabboUserBuilder {
        this.selectedBadges = selectedBadges;
        return this;
    }

    build (): HabboUser {
        return new HabboUser(this);
    }
}
