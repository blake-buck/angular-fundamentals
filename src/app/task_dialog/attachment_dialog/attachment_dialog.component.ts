import { Component, Inject } from '@angular/core';
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
        private store:Store<any>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog,
        private http:HttpClient,
        private snackbar:MatSnackBar
    ){}
    
    attachedFiles = [...this.data.attachedFiles];

    downloadLink = null;
    unsavedDownloads = [];
    
    isLoading = false;
    canSave = false;

    getFile(e){
        this.isLoading = true;
        let fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            
            this.http.post('http://localhost:7071/api/TaskAttachment', {name:e.target.files[e.target.files.length-1].name, base64:fileReader.result, taskName:`task${this.data.key}`}, {responseType:'json'}).subscribe((val:any) => {
                if(val.url){
                    this.attachedFiles.push({
                        link:val.url,
                        name:e.target.files[e.target.files.length-1].name
                    });
                    this.unsavedDownloads.push(e.target.files[e.target.files.length-1].name);
                    this.canSave=true;
                }
                else{
                    this.snackbar.open('Error uploading file! Please try again.', 'Close');
                }
                this.isLoading = false;
            })
        }
        fileReader.readAsDataURL(e.target.files[e.target.files.length - 1])
        
    }

    removeFile(index){
        this.http.delete('http://localhost:7071/api/TaskAttachment', {params:{name:this.attachedFiles[index].name, taskName:`task${this.data.key}`}}).subscribe(val => console.log(val))
        this.attachedFiles.splice(index, 1);
    }

    saveFiles(){
        this.data.attachedFiles = this.attachedFiles;
        if(this.data.attachedFiles.length){
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