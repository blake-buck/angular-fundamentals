import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectArchivedRows, selectArchivedBoards, selectArchivedTasks } from '../store/app.selector';
import { MatDialog } from '@angular/material';
import { restoreArchivedRow } from '../store/app.actions';
import { RestoreBoardDialogComponent } from './restore-board-dialog/restore-board-dialog.component';
import { RestoreTaskDialogComponent } from './restore-task-dialog/restore-task-dialog.component';

@Component({
    selector:'archived-items',
    templateUrl:'./archived-items.component.html',
    styleUrls:['./archived-items.component.scss']
})

export class ArchivedItemsComponent{
    archivedRows$:Observable<any>;
    archivedBoards$:Observable<any>;
    archivedTasks$:Observable<any>;

    constructor(private store:Store<any>, private dialog:MatDialog){
        this.archivedRows$ = this.store.select(selectArchivedRows);
        this.archivedBoards$ = this.store.select(selectArchivedBoards);
        this.archivedTasks$ = this.store.select(selectArchivedTasks);
    }

    closeDialog(){
        this.dialog.closeAll();
    }

    restoreRow(row){
        this.store.dispatch(restoreArchivedRow({row}))
    }

    restoreBoard(board){
        this.dialog.open(RestoreBoardDialogComponent, {
            data:board
        })
    }

    restoreTask(task){
        this.dialog.open(RestoreTaskDialogComponent, {
            data:task
        })
    }

}