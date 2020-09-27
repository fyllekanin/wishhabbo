import { Component } from '@angular/core';
import { HomeModel } from './home.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-default-home',
    templateUrl: 'home.component.html',
    styleUrls: [ 'home.component.css' ]
})
export class HomeComponent {
    data = new HomeModel();

    constructor (activatedRoute: ActivatedRoute) {
        this.data = activatedRoute.snapshot.data.data;
    }
}
