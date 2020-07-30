import { Injectable } from '@angular/core';
import { DialogButton, DialogConfiguration } from '../../../shared/app-views/dialog/dialog.model';
import { Subject } from 'rxjs';

@Injectable()
export class DialogService {
    private onActionSubject = new Subject<DialogButton>();
    private onOpenSubject = new Subject<DialogConfiguration<any>>();
    private onCloseSubject = new Subject<void>();
    onOpen = this.onOpenSubject.asObservable();
    onClose = this.onCloseSubject.asObservable();
    onAction = this.onActionSubject.asObservable();

    /**
     * Open a new instance of a dialog
     *
     * Listen to onAction to know when something happend.
     * When closed by clicking outside of it, then a action will
     * not be triggered.
     *
     * @param configuration
     */
    open<T> (configuration: DialogConfiguration<T>): void {
        this.onOpenSubject.next(configuration);
    }

    /**
     * Closes the dialog if open
     */
    close (): void {
        this.onCloseSubject.next();
    }
}
