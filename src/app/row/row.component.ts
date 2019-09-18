import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import 
{
    autoScroller
    ,editTitle
    ,editDescription
    ,onDragStart
    ,onDragOver
    ,onDrop
} from './row.logic';

import {getState, archiveRow, editRowTitle, editRowDescription, addBoard, transferBoard} from '../store/app.actions';

export interface AppState{
    simpleReducer:any
}

@Component({
    templateUrl:'./row.component.html',
    selector:'row',
    styleUrls:['./row.component.css']
})

export class RowComponent{

    // row$:Observable<any>;
    @Input() rowData:any;
    @Input() accordion:any;

    @ViewChild('scrollRow', {read: ElementRef, static:false}) scrollRow: ElementRef;

    board$:Observable<any>

    isEditingTitle = false;
    isEditingDescription = false;

    constructor(private store:Store<AppState>){
        this.board$ = this.store.select(state => state.simpleReducer.boards);
    }

    ngOnInit(){
        this.store.dispatch(getState())
    }

    editTitle = editTitle;
    onDragStart = onDragStart
    onDragOver = onDragOver
    editDescription = editDescription

    addBoard(row){
        this.store.dispatch(addBoard({key:row.key}))
    }

    archiveRow(key){
        this.store.dispatch(archiveRow({key}))
    }

    toggleEditDescription(row){
        this.isEditingDescription = !this.isEditingDescription;
        if(this.isEditingDescription === false){
            this.store.dispatch(editRowDescription({key:row.key, description:row.description}))
        }
    }

    toggleEditTitle(row){
        this.isEditingTitle = !this.isEditingTitle;
        if(this.isEditingTitle === false){
            this.store.dispatch(editRowTitle({key:row.key, title:row.title}))
        }
    }

    onDrop(e, row){
        let payload = onDrop(e, row);
        if(payload){
          this.store.dispatch(transferBoard({payload}));
        }
    }
    
}