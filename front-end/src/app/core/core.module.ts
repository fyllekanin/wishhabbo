import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RadioService } from './services/radio/radio.service';
import { DialogService } from './services/dialog/dialog.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [],
    providers: [],
    exports: []
})

export class CoreModule {
    static forRoot (): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                RadioService,
                DialogService
            ]
        };
    }
}
