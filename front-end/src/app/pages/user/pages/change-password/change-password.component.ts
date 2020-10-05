import { Component } from '@angular/core';
import { UserAction } from '../../../../shared/constants/common.interfaces';
import { ChangePasswordService } from './change-password.service';

@Component({
    selector: 'app-user-change-password',
    templateUrl: 'change-password.component.html',
    styleUrls: ['change-password.component.css']
})
export class ChangePasswordComponent {
    password: string;
    repassword: string;
    shouldDeleteTokens: boolean;

    contentActions: Array<UserAction> = [
        { label: 'Save', value: 'save' }
    ];

    constructor (private service: ChangePasswordService) {
    }

    async onSave (): Promise<void> {
        await this.service.changePassword(this.password, this.repassword, this.shouldDeleteTokens);
    }
}
