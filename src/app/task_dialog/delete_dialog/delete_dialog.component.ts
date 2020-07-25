import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { deleteTask } from 'src/app/store/app.actions';

@Component({
    templateUrl:'./delete_dialog.component.html',
    selector:'delete-dialog'
})

export class DeleteDialogComponent{
    constructor(
        public dialogRef: MatDialogRef<DeleteDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog,
        private store: Store<any>
    ){}

    onCloseDialog(){
        this.dialogRef.close();
    }

    deleteTask(){
        this.store.dispatch(deleteTask({task:this.data}));
        this.dialog.closeAll();
    }
}