import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableService } from './timetable.service';
import { TimetableComponent } from './timetable.component';
import { ContentModule } from '../content/content.module';

@NgModule({
    imports: [
        CommonModule,
        ContentModule
    ],
    declarations: [
        TimetableComponent
    ],
    providers: [
        TimetableService
    ],
    exports: [
        TimetableComponent
    ]
})
export class TimetableModule {
}
