import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { selectRows } from 'src/app/store/app.selector';
import { restoreArchivedBoard } from 'src/app/store/app.actions';

@Component({
    selector:'restore-board-dialog',
    templateUrl:'./restore-board-dialog.component.html',
    styleUrls:['../archived-items.component.scss']
})

export class RestoreBoardDialogComponent{
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private store:Store<any>,
        public dialogRef: MatDialogRef<RestoreBoardDialogComponent>,
        private dialog:MatDialog
    ){}

    rows$ = this.store.select(selectRows);
    selectedRow = null;

    restoreBoard(board){
        this.store.dispatch(restoreArchivedBoard({board, row:this.selectedRow}));
        this.dialog.closeAll();
    }

    onCloseDialog(){
        this.dialogRef.close();
    }
}