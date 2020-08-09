import { Component } from '@angular/core';
import { DialogService } from '../../../../core/common-services/dialog.service';
import { RadioService } from '../../../../core/common-services/radio.service';

@Component({
    selector: 'app-header-radio',
    templateUrl: 'header-radio.component.html',
    styleUrls: [ 'header-radio.component.css' ]
})
export class HeaderRadioComponent {
    constructor (
        private dialogService: DialogService,
        public radioService: RadioService
    ) {
    }

    openRequest (): void {
        this.dialogService.open({ title: 'test', content: 'test', buttons: [] });
    }
}
