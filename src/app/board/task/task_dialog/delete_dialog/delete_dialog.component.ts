import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
    templateUrl:'./delete_dialog.component.html',
    selector:'delete-dialog'
})

export class DeleteDialogComponent{
    constructor(
        public dialogRef: MatDialogRef<DeleteDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    onCloseDialog(){
        this.dialogRef.close();
    }
}