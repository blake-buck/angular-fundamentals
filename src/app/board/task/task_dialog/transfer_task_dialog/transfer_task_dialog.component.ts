import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Inject, Component } from '@angular/core';
import { transferTaskEmpty } from 'src/app/store/app.actions';
import { selectRows, selectBoards } from 'src/app/store/app.selector';

@Component({
    templateUrl:'./transfer_task_dialog.component.html',
    selector:'transfer-task-dialog',
    styleUrls:['./transfer_task_dialog.component.css']
})

export class TransferTaskDialogComponent{
    
    rows$: Observable<any>
    boards$: Observable<any>

    selectedRow=null;
    selectedBoard=null;

    constructor(
        private store:Store<any>,
        public dialogRef: MatDialogRef<TransferTaskDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){
        this.rows$ = this.store.select(selectRows);
        this.boards$ = this.store.select(selectBoards);
    }

    transferTask(){
        if(this.selectedBoard){
            this.store.dispatch(transferTaskEmpty({payload:{droppedTaskId:this.data.key, droppedTaskBoard:this.data.boardKey, droppedOnTaskBoard:this.selectedBoard.key}}))
            this.onCloseDialog();
        }
    }

    onCloseDialog(){
        this.dialogRef.close();
    }
}