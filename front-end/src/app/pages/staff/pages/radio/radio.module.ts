import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { TimetableModule } from '../../../../shared/components/timetable/timetable.module';
import { radioRoutes } from './radio.routes';

@NgModule({
    imports: [
        RouterModule.forChild(radioRoutes),
        CommonModule,
        TimetableModule
    ],
    declarations: [
        RadioComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class RadioModule {
}

