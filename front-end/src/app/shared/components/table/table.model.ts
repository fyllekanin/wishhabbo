export interface TableHeader {
    label: string;
}

export interface TableCell {
    label: string;
}

export interface TableAction {
    label: string;
    value: string | number;
}

export interface TableRow {
    isClickable?: boolean;
    rowId: number | string;
    cells: Array<TableCell>;
    actions?: Array<TableAction>;
}
