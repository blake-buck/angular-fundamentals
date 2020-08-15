import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRows, selectBoards } from 'src/app/store/app.selector';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { restoreArchivedTask } from 'src/app/store/app.actions';

@Component({
    selector:'restore-task-dialog',
    templateUrl:'./restore-task-dialog.component.html',
    styleUrls:['../archived-items.component.scss']
})

export class RestoreTaskDialogComponent{
    constructor(
        private store:Store<any>,
        @Inject(MAT_DIALOG_DATA) public data:any,
        private dialog:MatDialog,
        private dialogRef:MatDialogRef<RestoreTaskDialogComponent>
    ){}

    rows$ = this.store.select(selectRows);
    boards$ = this.store.select(selectBoards);

    selectedRow = null;
    selectedBoard = null;
    
    restoreTask(){
        this.store.dispatch(restoreArchivedTask({task:this.data, board:this.selectedBoard}));
        this.dialog.closeAll();
    }
    closeDialog(){
        this.dialogRef.close();
    }
}