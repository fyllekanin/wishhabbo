export interface UserAction {
    label: string;
    value: string | number;
}

export interface ValidationError {
    field: string;
    message: string;
    code: number;
}
