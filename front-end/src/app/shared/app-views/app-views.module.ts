import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { HeaderRadioComponent } from './header/radio/header-radio.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        HeaderComponent,
        HeaderRadioComponent,
        NavigationComponent,
        DialogComponent
    ],
    exports: [
        HeaderComponent,
        NavigationComponent,
        DialogComponent
    ]
})
export class AppViewsModule {
}


