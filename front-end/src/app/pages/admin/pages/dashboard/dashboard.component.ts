import { Component } from '@angular/core';
import { DashboardPage } from './dashboard.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent {
    data = new DashboardPage(null);

    constructor (activatedRoute: ActivatedRoute) {
        this.data = activatedRoute.snapshot.data.data;
    }
}
