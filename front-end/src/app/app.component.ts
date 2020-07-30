import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RadioService } from './core/services/radio/radio.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
})
export class AppComponent implements AfterContentInit {
    @ViewChild('radio', { static: true }) radioElement: ElementRef<HTMLAudioElement>;

    constructor (private radioService: RadioService) {
    }

    ngAfterContentInit (): void {
        this.radioService.setRadioElement(this.radioElement.nativeElement);
    }
}
