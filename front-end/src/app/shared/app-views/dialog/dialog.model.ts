import { Type } from '@angular/core';
import { primitiveOf } from '../../helpers/class.helper';

export class DialogButton {
    @primitiveOf(String)
    label: string;
    @primitiveOf(String)
    action: string;

    constructor (source: DialogButton) {
        Object.assign(this, source);
    }
}

export interface DialogConfiguration<T> {
    component?: Type<T>;
    title: string;
    content?: string;
    buttons: Array<DialogButton>;
}
