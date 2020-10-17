import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomePageSettingsModel } from './home-page-settings.model';

@Component({
    selector: 'app-admin-website-settings-home-page',
    templateUrl: 'home-page-settings.component.html',
    styleUrls: ['home-page-settings.component.css']
})
export class HomePageSettingsComponent {
    data = new HomePageSettingsModel(null);

    constructor (activatedRoute: ActivatedRoute) {
        this.data = activatedRoute.snapshot.data.data;
    }

}
