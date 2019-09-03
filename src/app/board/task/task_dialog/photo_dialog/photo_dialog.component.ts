import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
    templateUrl:'./photo_dialog.component.html',
    selector:'photo-dialog'
})
export class PhotoDialogComponent{
    
    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    imagesToDisplay = this.data.displayImageUrl;

    getFile(e){
        console.log(e.target.files);

        console.log(e.target.files[0])
        let fileReader = new FileReader();
        
        fileReader.onloadend = (e) => {
            console.log(fileReader.result)
            this.imagesToDisplay.push(fileReader.result);
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
        this.data.displayImageUrl=this.imagesToDisplay;
        this.dialogRef.close();
        this.dialogRef.afterClosed().subscribe(result => {
            this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        })
    }

    
}