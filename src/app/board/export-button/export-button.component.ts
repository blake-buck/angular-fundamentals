import { Component, Input, ContentChild, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
    selector:'export-button',
    templateUrl:'./export-button.component.html',
    
})

export class ExportButtonComponent{

    @Input() exportLink:any;
    @Input() title:any;

    @Output() linkHasBegunDownload = new EventEmitter();

    @ViewChild('exportButton', {read: ElementRef, static:false}) exportButton:ElementRef;

    constructor(){}

    ngOnInit(){
        
    }
    ngAfterViewInit(){
        this.exportButton.nativeElement.click();
        this.linkHasBegunDownload.emit();
    }
    
}