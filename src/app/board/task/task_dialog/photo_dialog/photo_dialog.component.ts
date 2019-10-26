import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { editTask } from 'src/app/store/app.actions';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { by } from 'protractor';

@Component({
    templateUrl:'./photo_dialog.component.html',
    selector:'photo-dialog'
})
export class PhotoDialogComponent{
    
    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog,
        private http: HttpClient
    ){}

    imagesToDisplay = []

    getFile(e){
        let fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            this.imagesToDisplay.push(fileReader.result);
            this.http.post('http://localhost:7071/api/BlobUpload', {name:e.target.files[0].name, base64:fileReader.result}).subscribe(val => {
                // console.log(val)
            })
        }
        fileReader.readAsDataURL(e.target.files[0])
    }

    onCloseDialog(){
        this.dialogRef.close();
    }

    clearImage(){
        if(this.imagesToDisplay.length > 0){
            this.imagesToDisplay.pop();
        }
        
    }

    saveImage(){
        this.dialogRef.close();
        this.dialogRef.afterClosed().subscribe(result => {
            this.store.dispatch(editTask({task:{...this.data, displayImageUrls:[...this.data.displayImageUrls, this.imagesToDisplay]}}))
        })
    }

    
}
