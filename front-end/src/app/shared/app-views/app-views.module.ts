import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { HeaderRadioComponent } from './header/radio/header-radio.component';
import { DialogComponent } from './dialog/dialog.component';
import { RouterModule } from '@angular/router';
import { SiteNotificationComponent } from './site-notification/site-notification.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        HeaderComponent,
        HeaderRadioComponent,
        NavigationComponent,
        DialogComponent,
        SiteNotificationComponent
    ],
    exports: [
        HeaderComponent,
        NavigationComponent,
        DialogComponent,
        SiteNotificationComponent
    ]
})
export class AppViewsModule {
}


