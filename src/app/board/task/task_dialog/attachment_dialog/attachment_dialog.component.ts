import { Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppState } from 'src/app/app.component';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PhotoDialogComponent } from '../photo_dialog/photo_dialog.component';
import { editTask } from 'src/app/store/app.actions';

@Component({
    templateUrl:'./attachment_dialog.component.html',
    selector:'attachment-dialog',
    styleUrls:['./attachment_dialog.component.css']
})

export class AttachmentDialogComponent{
    constructor(
        private sanitization:DomSanitizer,
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    downloadLink = null;
    downloadLinks = [...this.data.downloadLinks];
    downloadNames = [...this.data.downloadNames];
    
    getFile(e){

        let fileReader = new FileReader();

        fileReader.onloadend = (e) => {
            let untrustedLink:any = fileReader.result
            this.downloadLink = this.sanitization.bypassSecurityTrustUrl(untrustedLink);
            this.downloadLinks.push(this.downloadLink)
        }
        console.log(e.target.files[0])
        let file = e.target.files[e.target.files.length-1];
        if(file){
            this.downloadNames.push(file.name)
            fileReader.readAsDataURL(e.target.files[e.target.files.length-1])
        }
        
        
    }

    removeFile(index){
        this.downloadNames.splice(index, 1);
        this.downloadLinks.splice(index, 1);
    }

    saveFiles(){
        this.data.downloadNames = this.downloadNames;
        this.data.downloadLinks = this.downloadLinks;
        if(this.data.downloadLinks.length > 0){
            this.data.attachment = true;
        }
        else{
            this.data.attachment = false;
        }
        this.store.dispatch(editTask({task:this.data}))
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        this.dialogRef.close();
    }

    onCloseDialog(){
        this.dialogRef.close();
    }
}