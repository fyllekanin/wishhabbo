import { NgModule } from '@angular/core';
import { HabboBadgeDirective } from './habbo-badge.directive';
import { HabboBadgeComponent } from './habbo-badge.component';

@NgModule({
    declarations: [
        HabboBadgeDirective,
        HabboBadgeComponent
    ],
    exports: [
        HabboBadgeDirective,
        HabboBadgeComponent
    ]
})
export class HabboBadgeModule {
}
