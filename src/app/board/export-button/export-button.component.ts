import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

// This component is never visible to the user; as soon as it renders it clicks itself to begin download, emitting a message telling its parent component
// to remove it from the DOM

// takes in a file title (title) and a dataurl (exportData)

@Component({
    selector:'export-button',
    templateUrl:'./export-button.component.html',
})

export class ExportButtonComponent{

    @Input() exportData:string;
    @Input() title:string;

    @Output() linkHasBegunDownload = new EventEmitter();

    @ViewChild('exportButton', {read: ElementRef, static:false}) exportButton:ElementRef;

    ngAfterViewInit(){
        this.exportButton.nativeElement.click();
        this.linkHasBegunDownload.emit();
    }
    
}