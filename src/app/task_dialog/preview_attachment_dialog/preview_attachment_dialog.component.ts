import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
    template:`
    <img *ngIf='isImage' [src]='imgSrc' />
    `,
    selector:'preview-attachment-dialog'
})

export class PreviewAttachmentDialogComponent{
    constructor(
        private store:Store<any>,
        private sanitization:DomSanitizer,
        public dialogRef: MatDialogRef<PreviewAttachmentDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    isImage = false;
    imgSrc;
    isText  = false;

    ngOnInit(){
        if(this.data.changingThisBreaksApplicationSecurity.includes('image')){
            this.isImage = true;
            this.imgSrc = this.sanitization.bypassSecurityTrustUrl(this.data);
        }
    }
}