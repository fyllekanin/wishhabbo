import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppViewsModule } from './shared/app-views/app-views.module';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';

@NgModule({
    imports: [
        CoreModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        AppViewsModule,
        BrowserModule,
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
