import { Component } from "@angular/core";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { selectRows, selectIsDataSaved, selectBoardCount, selectTaskCount, selectRowCount } from '../store/app.selector';
import { getState, addRow } from '../store/app.actions';

@Component({
    selector:'row-holder',
    templateUrl:'./row-holder.component.html',
    styleUrls:['./row-holder.component.scss']
})

export class RowHolderComponent{
    board$:Observable<any>
    row$:Observable<any>

    rowCount$:Observable<any>;
    boardCount$:Observable<any>;
    taskCount$:Observable<any>;

    dataSaved$:Observable<boolean>

    constructor(private store:Store<any>){
        this.row$ = this.store.select(selectRows)
        this.dataSaved$ = this.store.select(selectIsDataSaved);
        this.rowCount$ = this.store.select(selectRowCount);
        this.boardCount$ = this.store.select(selectBoardCount);
        this.taskCount$ = this.store.select(selectTaskCount);
    }

    ngOnInit(){
        this.store.dispatch(getState())
    }

    addRow(){
        this.store.dispatch(addRow())
    }
}