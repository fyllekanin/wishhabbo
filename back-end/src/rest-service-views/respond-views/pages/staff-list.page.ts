import { SlimUserView } from '../../two-way/slim-user.view';

export class StaffListRow {
    private readonly groupId: number;
    private readonly name: string;
    private readonly nameColor: string;
    private readonly displayOrder: number;
    private readonly users: Array<SlimUserView>;

    constructor (builder: StaffListRowBuilder) {
        this.groupId = builder.groupId;
        this.name = builder.name;
        this.nameColor = builder.nameColor;
        this.displayOrder = builder.displayOrder;
        this.users = [ ...builder.users ];
    }

    getGroupId (): number {
        return this.groupId;
    }

    getName (): string {
        return this.name;
    }

    getNameColor (): string {
        return this.nameColor;
    }

    getDisplayOrder (): number {
        return this.displayOrder;
    }

    getUsers (): Array<SlimUserView> {
        return [ ...this.users ];
    }

    static newBuilder (): StaffListRowBuilder {
        return new StaffListRowBuilder();
    }
}

class StaffListRowBuilder {
    groupId: number;
    name: string;
    nameColor: string;
    displayOrder: number;
    users: Array<SlimUserView>;

    withGroupId (groupId: number): StaffListRowBuilder {
        this.groupId = groupId;
        return this;
    }

    withName (name: string): StaffListRowBuilder {
        this.name = name;
        return this;
    }

    withNameColor (nameColor: string): StaffListRowBuilder {
        this.nameColor = nameColor;
        return this;
    }

    withDisplayOrder (displayOrder: number): StaffListRowBuilder {
        this.displayOrder = displayOrder;
        return this;
    }

    withUsers (users: Array<SlimUserView>): StaffListRowBuilder {
        this.users = users;
        return this;
    }

    build (): StaffListRow {
        return new StaffListRow(this);
    }
}


export class StaffListPage {
    private readonly rows: Array<StaffListRow>;

    constructor (builder: StaffListPageBuilder) {
        this.rows = [ ...builder.rows ];
    }

    getRows (): Array<StaffListRow> {
        return [ ...this.rows ];
    }

    static newBuilder (): StaffListPageBuilder {
        return new StaffListPageBuilder();
    }
}

class StaffListPageBuilder {
    rows: Array<StaffListRow>;

    withRows (rows: Array<StaffListRow>): StaffListPageBuilder {
        this.rows = rows;
        return this;
    }

    build (): StaffListPage {
        return new StaffListPage(this);
    }
}
