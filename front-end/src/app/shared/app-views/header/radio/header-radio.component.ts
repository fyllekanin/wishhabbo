import { Component } from '@angular/core';
import { DialogService } from '../../../../core/common-services/dialog.service';

@Component({
    selector: 'app-header-radio',
    templateUrl: 'header-radio.component.html',
    styleUrls: [ 'header-radio.component.css' ]
})
export class HeaderRadioComponent {

    constructor (private dialogService: DialogService) {

    }

    openRequest (): void {
        this.dialogService.open({ title: 'test', content: 'test', buttons: [] });
    }
}
