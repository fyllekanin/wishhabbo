import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IdHelper } from '../../../../../../back-end/src/helpers/id.helper';

declare var $: any;

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: [ 'editor.component.css' ]
})
export class EditorComponent implements AfterViewInit {
    private id = IdHelper.newUuid();
    private content: string;
    private editor;
    @ViewChild('editor') myEditorWrapper: ElementRef<HTMLTemplateElement>;

    getContent (): string {
        return this.editor ? this.editor.getBBCode() : '';
    }

    setContent (content: string): void {
        this.content = content || '';
        // @ts-ignore
        $(document).ready(() => {
            if (this.editor) {
                this.editor.bbcode(content);
            }
        });
    }

    ngAfterViewInit (): void {
        this.myEditorWrapper.nativeElement.className = this.id;
        // @ts-ignore
        $(document).ready(() => {
            const settings = this.getSettings(this.id);
            // @ts-ignore
            this.editor = $(`.${this.id}`).wysibb(settings);
            this.editor.bbcode(this.content);
        });
    }

    private getSettings (id: string): any {
        return {
            id: id,
            debug: false,
            minheight: 150,
            buttons: 'bold,italic,underline,strike|,img,video,link,|,bullist,numlist,|,fontcolor,fontsize' +
                ',fontfamily,|,justifyleft,justifycenter,justifyright,|,atitle,,quote,code,table,removeFormat,test',
            systr: {
                '<ol>{DATA}</ol>': '[ol]{DATA}[/ol]',
                '<li>{DATA}</li>': '[li]{DATA}[/li]',
                '<ul>{DATA}</ul>': '[ul]{DATA}[/ul]',
                '<img src="{URL}" align="right">': '[imgr]{URL}[/imgr]',
                '<img src="{URL}" align="left">': '[imgl]{URL}[/imgl]',
                '<div class="atitle">{SELTEXT}</div>': '[atitle]{SELTEXT}[/atitle]'
            },
            allButtons: {
                quote: {
                    title: 'Spoiler',
                    transform: {
                        '<details><summary>Spoiler</summary>{SELTEXT}</details>': '[spoiler]{SELTEXT}[/spoiler]'
                    }
                }
            }
        };
    }
}
