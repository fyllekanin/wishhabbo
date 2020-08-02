import {
    Component,
    ComponentFactoryResolver,
    HostBinding,
    HostListener,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { DialogService } from '../../../core/common-services/dialog.service';

@Component({
    selector: 'app-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: [ 'dialog.component.css' ]
})
export class DialogComponent {
    @ViewChild('container', { read: ViewContainerRef, static: true }) containerElement;
    @HostBinding('class.visible') isVisible = false;

    content: string = null;
    title: string = null;

    constructor (private dialogService: DialogService, private componentFactoryResolver: ComponentFactoryResolver) {
        dialogService.onOpen.subscribe(configuration => {
            this.onReset();

            this.isVisible = true;
            this.title = configuration.title;
            if (configuration.component) {
                this.containerElement
                    .createComponent(this.componentFactoryResolver.resolveComponentFactory((configuration.component)));
            } else {
                this.content = configuration.content;
            }
        });
        dialogService.onClose.subscribe(() => this.isVisible = false);
    }

    @HostListener('click', [ '$event' ])
    onClose (event): void {
        const path = event ? event.composedPath ? event.composedPath() : (event.path || []) : [];
        if (path.length === 0) {
            return;
        }
        const isInsideWrapper = path
            .some(item => item.classList && item.classList.contains('dialog-wrapper'));
        if (!isInsideWrapper) {
            this.isVisible = false;
        }
    }

    private onReset (): void {
        this.containerElement.clear();
        this.title = null;
        this.content = null;
    }
}
