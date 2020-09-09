export interface StaffListEntry {
    groupId: number;
    displayOrder: number;
}

export interface StaffListModel {
    entries: Array<StaffListEntry>;
}
