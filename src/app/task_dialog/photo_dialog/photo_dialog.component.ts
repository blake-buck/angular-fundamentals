import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { editTask } from 'src/app/store/app.actions';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl:'./photo_dialog.component.html',
    styleUrls:['./photo_dialog.component.css'],
    selector:'photo-dialog'
})
export class PhotoDialogComponent{
    
    constructor(
        private store:Store<any>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog,
        private http: HttpClient,
        public snackbar: MatSnackBar
    ){}

    realImages = [...this.data.displayImageUrls, ...[]]
    canSave = false;
    isLoading = false;
    file;

    getFile(e){
        this.isLoading = true;
        let fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            
            this.http.post('http://localhost:7071/api/DisplayPhoto', {name:e.target.files[0].name, base64:fileReader.result, taskName:`task${this.data.key}`}, {responseType:'json'}).subscribe((val:any) => {
                if(val.url){
                    this.realImages.push(val.url)
                    // this.unsavedImages.push(val.url)
                    this.canSave=true;
                }
                else{
                    this.snackbar.open('Error uploading photo! Please try again.', 'Close')
                }
                this.isLoading = false

                
            })
        }
        fileReader.readAsDataURL(e.target.files[0])
        
    }

    onCloseDialog(){
        // this.unsavedImages.map(val => {
        //     let fileName = /display\/.+\?sv=/.exec(val)[0].replace('display/', '').replace('?sv=' ,'')
        //     this.http.delete('http://localhost:7071/api/DisplayPhoto', {params:{name:fileName, taskName:`task${this.data.key}`}}).subscribe(val => console.log(val))
        // })
        this.dialogRef.close(); 
    }

    clearImage(index){
        if(this.realImages.length > 0){
            // Best practice? of course not. Good regex practice? hell yeah!
            let fileName = /display\/.+\?sv=/.exec(this.realImages[index])[0].replace('display/', '').replace('?sv=' ,'')
            // console.log(/display\/.+\?sv=/.exec(this.realImages[this.realImages.length-1])[0].replace('display/', '').replace('?sv=' ,''))
            this.http.delete('http://localhost:7071/api/DisplayPhoto', {params:{name:fileName, taskName:`task${this.data.key}`}}).subscribe(val => console.log(val))

            this.realImages.splice(index, 1);
    
            // this.http.delete('http://localhost:7071/api/DisplayPhoto')//, {params:{param:'jeff'}}
            // this.http.delete('', {name:fileName, taskName:`task${this.data.key}`})
        }
        
    }

    saveImage(){
        this.dialogRef.close();
        this.dialogRef.afterClosed().subscribe(result => {
            this.store.dispatch(editTask({task:{...this.data, displayImageUrls:this.realImages}}))
        })
    }

    
}
