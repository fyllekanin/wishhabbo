import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomePageSettingsModel } from './home-page-settings.model';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { HomePageSettingsService } from './home-page-settings.service';

@Component({
    selector: 'app-admin-website-settings-home-page',
    templateUrl: 'home-page-settings.component.html',
    styleUrls: ['home-page-settings.component.css']
})
export class HomePageSettingsComponent {
    private readonly ACTIONS = {
        SAVE: 'SAVE',
        GO_BACK: 'GO_BACK'
    };
    data = new HomePageSettingsModel(null);

    contentActions: Array<UserAction> = [
        { label: 'Save', value: this.ACTIONS.SAVE },
        { label: 'Go back', value: this.ACTIONS.GO_BACK }
    ]

    constructor (
        private service: HomePageSettingsService,
        activatedRoute: ActivatedRoute
    ) {
        this.data = activatedRoute.snapshot.data.data;
    }

    async onAction (action: UserAction): Promise<void> {
        // empty
    }
}
