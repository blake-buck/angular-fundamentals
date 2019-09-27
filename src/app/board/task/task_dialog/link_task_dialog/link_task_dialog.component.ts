import {Component, Injectable, Inject} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { selectRows, selectBoards } from 'src/app/store/app.selector';
import { linkTask } from 'src/app/store/app.actions';

@Component({
    selector:'link-task-dialog',
    templateUrl:'./link_task_dialog.component.html',
    styleUrls:['./link_task_dialog.component.css']
})

export class LinkTaskDialogComponent{
    rows$ = this.store.select(selectRows);
    boards$ = this.store.select(selectBoards);

    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<LinkTaskDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    logShit(jeff){
        console.log(jeff)
    }

    linkTask(linkedBoardKey, linkedTaskKey){
        this.store.dispatch(linkTask({linkedBoardKey, linkedTaskKey, originalTaskKey:this.data.key, originalBoardKey:this.data.boardKey}))
        this.dialogRef.close();
    }

    closeDialog(){
        this.dialogRef.close();
    }

    jeff(task){
        return this.data.linkedTasks.some(val => val.taskKey === task.key)
    }
}