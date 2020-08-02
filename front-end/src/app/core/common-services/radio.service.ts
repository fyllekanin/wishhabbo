import { Injectable } from '@angular/core';

@Injectable()
export class RadioService {
    private radioElement: HTMLAudioElement;
    private volume = 100;

    isPlaying = false;

    setRadioElement (radioElement: HTMLAudioElement): void {
        this.radioElement = radioElement;
    }

    toggleRadio (): void {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.radioElement.play();
        } else {
            this.radioElement.pause();
        }
    }
}
