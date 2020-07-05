import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { deleteBoard } from 'src/app/store/app.actions';

@Component({
    templateUrl:'./delete-board-dialog.component.html',
    selector:'delete-board-dialog'
})

export class DeleteBoardDialogComponent{
    constructor(
        private store:Store<any>,
        public dialogRef: MatDialogRef<DeleteBoardDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    onCloseDialog(){
        this.dialogRef.close();
    }

    deleteBoard(){
        this.store.dispatch(deleteBoard({key:this.data}))
        this.dialogRef.close();
    }
}