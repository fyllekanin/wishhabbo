import { Injectable } from '@angular/core';
import { LocalStorageKeys } from '../../shared/constants/local-storage.constants';
import { RadioSettingsClass } from '../../shared/classes/radio-settings.class';

@Injectable()
export class RadioService {
    private radioSettings: RadioSettingsClass;
    private radioElement: HTMLAudioElement;
    private volume = 100;

    isPlaying = false;

    constructor () {
        const volume = Number(localStorage.getItem(LocalStorageKeys.RADIO_VOLUME));
        if (Number.isInteger(volume)) {
            this.volume = volume;
        }
    }

    setRadioSettings (radioSettings: RadioSettingsClass): void {
        this.radioSettings = radioSettings;
        this.updateRadio();
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
            this.updateRadio();
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

    private updateRadio (): void {
        if (!this.radioSettings || !this.getRadioElement()) {
            return;
        }

        const radioElement = this.getRadioElement();
        radioElement.src = this.getRadioUrl();
    }

    private getRadioUrl (): string {
        if (this.radioSettings.isAzuraCast) {
            return `${this.radioSettings.host}/radio/${this.radioSettings.port}/${this.radioSettings.mountPoint}`;
        }
        return null;
    }
}
