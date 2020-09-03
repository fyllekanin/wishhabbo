import { Injectable } from '@angular/core';
import { LocalStorageKeys } from '../../shared/constants/local-storage.constants';

@Injectable()
export class RadioService {
    private static readonly TEMP_RADIO_INFO = {
        HOST: 'https://wishhabbo.co',
        PORT: '8000',
        isAzureCast: true
    };

    private radioElement: HTMLAudioElement;
    private volume = 100;

    isPlaying = false;

    constructor () {
        const volume = Number(localStorage.getItem(LocalStorageKeys.RADIO_VOLUME));
        if (Number.isInteger(volume)) {
            this.volume = volume;
        }
    }

    setRadioElement (radioElement: HTMLAudioElement): void {
        this.radioElement = radioElement;
        this.radioElement.volume = this.volume / 100;
    }

    getRadioElement (): HTMLAudioElement {
        return this.radioElement;
    }

    toggleRadio (): void {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.setInformation();
            this.radioElement.play();
        } else {
            this.radioElement.pause();
        }
    }

    doUpVolume (): void {
        if (this.volume >= 100) {
            this.volume = 100;
            return;
        }

        this.volume += 10;
        localStorage.setItem(LocalStorageKeys.RADIO_VOLUME, this.volume.toString());
        this.radioElement.volume = this.volume / 100;
    }

    doDownVolume (): void {
        if (this.volume <= 0) {
            this.volume = 0;
            return;
        }

        this.volume -= 10;
        localStorage.setItem(LocalStorageKeys.RADIO_VOLUME, this.volume.toString());
        this.radioElement.volume = this.volume / 100;
    }

    private setInformation (): void {
        const radioElement = this.getRadioElement();
        radioElement.src = `${RadioService.TEMP_RADIO_INFO.HOST}/radio/${RadioService.TEMP_RADIO_INFO.PORT}/radio.mp3`;
    }
}
