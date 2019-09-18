import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Inject, Component } from '@angular/core';
import { AppState } from 'src/app/app.component';
import { transferTaskEmpty } from 'src/app/store/app.actions';

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
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<TransferTaskDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){
        this.rows$ = this.store.select(state => state.simpleReducer.rows)
        this.boards$ = this.store.select(state => state.simpleReducer.boards)
    }

    transferTask(){
        if(this.selectedBoard){
            this.store.dispatch(transferTaskEmpty({payload:{droppedTaskId:this.data.key, droppedTaskBoard:this.data.boardKey, droppedOnTaskBoard:this.selectedBoard.key}}))
            this.dialogRef.close()
        }
    }

    onCloseDialog(){
        this.dialogRef.close();
    }
}