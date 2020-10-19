import { Component, ElementRef, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomePageSettingsModel } from './home-page-settings.model';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { HomePageSettingsService } from './home-page-settings.service';
import { HomePageBannerEntry } from '../../../../../shared/classes/home-page.class';
import { SlideShowImage } from '../../../../../shared/components/slide-show/slide-show.component';
import { IdHelper } from '../../../../../../../../back-end/src/helpers/id.helper';

@Component({
    selector: 'app-admin-website-settings-home-page',
    templateUrl: 'home-page-settings.component.html',
    styleUrls: ['home-page-settings.component.css']
})
export class HomePageSettingsComponent {
    private readonly ACTIONS = {
        SAVE: 'SAVE',
        GO_BACK: 'GO_BACK'
    };
    @ViewChildren('image') imageElements: Array<ElementRef> = [];
    data = new HomePageSettingsModel(null);

    images: Array<SlideShowImage> = [];
    addNewEntryAction: Array<UserAction> = [
        { label: 'Add entry', value: null }
    ];
    contentActions: Array<UserAction> = [
        { label: 'Save', value: this.ACTIONS.SAVE },
        { label: 'Go back', value: this.ACTIONS.GO_BACK }
    ];

    constructor (
        private service: HomePageSettingsService,
        activatedRoute: ActivatedRoute
    ) {
        this.data = activatedRoute.snapshot.data.data;
        this.images = this.data.bannerEntries.map(entry => ({
            id: entry.id,
            link: `/resources/banner-entries/${entry.id}.gif`,
            caption: entry.caption,
            isActive: false
        }));
    }

    addNewEntry (): void {
        this.data.bannerEntries.push(new HomePageBannerEntry({ id: IdHelper.newUuid(), isNew: true }));
    }

    onCaptionChange (): void {
        this.images.forEach(image => {
            const entry = this.data.bannerEntries.find(entry => entry.id === image.id);
            if (entry) {
                image.caption = entry.caption;
            }
        });
    }

    deleteEntry (entry: HomePageBannerEntry): void {
        entry.isDeleted = true;
    }

    async onFileChange (event: any, entry: HomePageBannerEntry): Promise<void> {
        const result = await this.getFile(event);
        entry.isUpdated = true;
        if (!result) {
            return;
        }
        let image = this.images.find(image => image.id === entry.id);
        if (!image) {
            this.images.push({
                id: entry.id,
                link: result,
                caption: entry.caption,
                isActive: false
            });
        } else {
            image.link = result;
        }
    }

    async onAction (_action: UserAction): Promise<void> {
        // empty
    }

    private getFile (event: any): Promise<any> {
        return new Promise(res => {
            if (!event.target.files[0]) {
                res(null);
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                res(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    }
}
