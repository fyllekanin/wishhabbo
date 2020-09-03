import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: [ 'editor.component.css' ]
})
export class EditorComponent implements AfterViewInit {
    private content: string;
    private editor;
    @ViewChild('editor') myEditorWrapper: ElementRef<HTMLTemplateElement>;

    getContent (): string {
        return this.editor.getWysiwygEditorValue(true);
    }

    setContent (content: string): void {
        if (this.editor) {
            this.editor.val(content, true);
        } else {
            this.content = content;
        }
    }

    ngAfterViewInit (): void {
        // @ts-ignore
        sceditor.create(this.myEditorWrapper.nativeElement, {
            format: 'bbcode',
            style: '/assets/editor/themes/content/default.css',
            emoticonsEnabled: false,
            width: '100%',
            resizeWidth: false,
            resizeHeight: true,
            height: '250px',
            toolbarExclude: 'code,quote,ltr,rtl,print,maximize,email,horizontalrule,cut,copy,pastetext'
        });
        // @ts-ignore
        this.editor = sceditor.instance(this.myEditorWrapper.nativeElement);
    }
}
