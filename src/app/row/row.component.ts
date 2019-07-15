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
    @Input() accordion:any;

    board$:Observable<any>

    

    isEditingTitle = false;
    isEditingDescription = false;

    constructor(private store:Store<AppState>){
        this.board$ = this.store.select(state => state.simpleReducer.boards);
    }

    ngOnInit(){
        this.store.dispatch({type:'GET_STATE', payload:''})
    }

    handleClose(e){
        console.log(e)
    }

    toggleEditTitle(row){
        this.isEditingTitle = !this.isEditingTitle;
        if(this.isEditingTitle === false){
            this.store.dispatch({type:'EDIT_ROW_TITLE', payload:{key:row.key, title:row.title}})
        }
    }
    editTitle(e, row){
        row.title = e.target.value;
    }

    toggleEditDescription(row){
        this.isEditingDescription = !this.isEditingDescription;
        if(this.isEditingDescription === false){
            this.store.dispatch({type:'EDIT_ROW_TITLE', payload:{key:row.key, title:row.description}})
        }
    }
    editDescription(e, row){
        row.description = e.target.value;
    }

    addBoard(row){
        this.store.dispatch({type:'ADD_BOARD', payload:row.key})
    }

    archiveRow(key){
        this.store.dispatch({type:'ARCHIVE_ROW', payload:key})
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