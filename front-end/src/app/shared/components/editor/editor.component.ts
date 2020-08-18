import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: [ 'editor.component.css' ]
})
export class EditorComponent implements AfterViewInit {
    private editor;
    @ViewChild('editor') myEditorWrapper: ElementRef<HTMLTemplateElement>;

    ngAfterViewInit (): void {
        // @ts-ignore
        this.editor = sceditor.create(this.myEditorWrapper.nativeElement, {
            format: 'bbcode',
            style: '/assets/editor/themes/content/default.css',
            emoticonsEnabled: false,
            width: '100%',
            resizeWidth: false,
            resizeHeight: false,
            height: '250px',
            toolbarExclude: 'code,quote,ltr,rtl,print,maximize,email,horizontalrule,cut,copy,pastetext'
        });
    }
}
