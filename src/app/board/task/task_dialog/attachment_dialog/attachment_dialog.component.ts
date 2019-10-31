import { Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppState } from 'src/app/app.component';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { PhotoDialogComponent } from '../photo_dialog/photo_dialog.component';
import { editTask } from 'src/app/store/app.actions';
import { HttpClient } from '@angular/common/http';

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
        public dialog:MatDialog,
        private http:HttpClient,
        private snackbar:MatSnackBar
    ){}

    downloadLink = null;
    downloadLinks = [...this.data.downloadLinks];
    unsavedDownloads = []
    downloadNames = [...this.data.downloadNames];
    
    isLoading = false;
    canSave = false;

    getFile(e){

        // let fileReader = new FileReader();

        // fileReader.onloadend = (e) => {
        //     let untrustedLink:any = fileReader.result
        //     this.downloadLink = this.sanitization.bypassSecurityTrustUrl(untrustedLink);
        //     this.downloadLinks.push(this.downloadLink)
        // }
        // let file = e.target.files[e.target.files.length-1];
        // if(file){
        //     this.downloadNames.push(file.name)
        //     fileReader.readAsDataURL(e.target.files[e.target.files.length-1])
        // }
        this.isLoading = true;
        let fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            
            this.http.post('http://localhost:7071/api/TaskAttachment', {name:e.target.files[e.target.files.length-1].name, base64:fileReader.result, taskName:`task${this.data.key}`}, {responseType:'json'}).subscribe((val:any) => {
                if(val.url){
                    this.downloadLinks.push(val.url)
                    this.unsavedDownloads.push(e.target.files[e.target.files.length-1].name)
                    this.downloadNames.push(e.target.files[e.target.files.length-1].name)
                    this.canSave=true;
                }
                else{
                    this.snackbar.open('Error uploading file! Please try again.', 'Close')
                }
                this.isLoading = false
            })
        }
        fileReader.readAsDataURL(e.target.files[e.target.files.length - 1])
        
    }

    removeFile(index){
        this.http.delete('http://localhost:7071/api/TaskAttachment', {params:{name:this.downloadNames[index], taskName:`task${this.data.key}`}}).subscribe(val => console.log(val))

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
        this.unsavedDownloads = [];
        this.store.dispatch(editTask({task:this.data}));
        this.dialogRef.close();
    }

    onCloseDialog(){
        this.unsavedDownloads.map(filename => {
            this.http.delete('http://localhost:7071/api/TaskAttachment', {params:{name:filename, taskName:`task${this.data.key}`}}).subscribe(val => console.log(val))

        })
        this.dialogRef.close();
    }
}