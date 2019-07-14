import { Component, Input } from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

export interface AppState{
    simpleReducer:any
}

@Component({
    templateUrl:'./row.component.html',
    selector:'row'
})

export class RowComponent{

    // row$:Observable<any>;
    @Input() rowData:any;

    board$:Observable<any>

    constructor(private store:Store<AppState>){
        this.board$ = this.store.select(state => state.simpleReducer.boards);
    }

    ngOnInit(){
        this.store.dispatch({type:'GET_STATE', payload:''})
    }

    addBoard(row){
        this.store.dispatch({type:'ADD_BOARD', payload:row.key})
    }

    onDragOver(e){
        e.preventDefault();
    }
    
    onDrop(e, row){
        let eventDataTransfer = e.dataTransfer.getData('text');
        if(eventDataTransfer.includes('BOARD')){
          console.log(eventDataTransfer)
          let unSanitizedKeys = eventDataTransfer.replace('BOARD', '');
          let keyArray = unSanitizedKeys.split('-')
          let droppedOnBoardKey = -1;
          if(+keyArray[1] !== row.key)
          this.store.dispatch({type:'TRANSFER_BOARD', payload:{draggedBoardKey:+keyArray[0], draggedBoardRowKey:+keyArray[1], droppedOnBoardKey, droppedOnRowKey:row.key}})
        }
    }
}