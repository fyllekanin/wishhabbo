import { AfterViewInit, Component } from '@angular/core';
import { HomeModel } from './home.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-default-home',
    templateUrl: 'home.component.html',
    styleUrls: [ 'home.component.css' ]
})
export class HomeComponent implements AfterViewInit {
    data = new HomeModel();

    constructor (activatedRoute: ActivatedRoute) {
        this.data = activatedRoute.snapshot.data.data;
    }

    ngAfterViewInit (): void {
        (<any>window).twttr.widgets.load();
    }
}
