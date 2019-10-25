import { Component, Input, ViewChild, ElementRef, Injectable } from '@angular/core';

import {Store, select} from '@ngrx/store';
import {Observable, pipe} from 'rxjs';

import 
{
    autoScroller
    ,editTitle
    ,editDescription
    ,onDragStart
    ,onDragOver
    ,onDrop
} from './row.logic';

import {getState, archiveRow, editRowTitle, editRowDescription, addBoard, transferBoard, duplicateRow, scrollRowForward, scrollRowBackward} from '../store/app.actions';
import { selectBoards, selectSpecificBoards } from '../store/app.selector';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

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
    specificBoards$;

    isEditingTitle = false;
    isEditingDescription = false;

    canScrollRow = false;

    constructor(private store:Store<AppState>, private actions$:Actions){}
    ngOnInit(){
        this.board$ = this.store.pipe(select(selectSpecificBoards, this.rowData.key))
        
    }

    ngOnDestroy(){
        this.scroll.unsubscribe()
    }

    onMouseEnter(e){
        e.preventDefault();
        this.canScrollRow = true;
    }
    onMouseLeave(e){
        e.preventDefault();
        this.canScrollRow = false;
    }

    scroll = this.actions$.subscribe(val => {
        // console.log(val.type)
        if(val.type === scrollRowForward.type && this.canScrollRow){
            if(this.scrollRow && this.scrollRow.nativeElement){
                this.scrollRow.nativeElement.scrollLeft = this.scrollRow.nativeElement.scrollLeft + 6; 
            }
        }
        else if(val.type === scrollRowBackward.type && this.canScrollRow){
            if(this.scrollRow && this.scrollRow.nativeElement){
                this.scrollRow.nativeElement.scrollLeft = this.scrollRow.nativeElement.scrollLeft - 6;
            }
        }
    })

    editTitle(e, rowData){
        this.store.dispatch(editRowTitle({key:rowData.key, title:e.target.value}))
    }
    editDescription(e, rowData){
        this.store.dispatch(editRowDescription({key:rowData.key, description:e.target.value}))
    }
    onDragStart = onDragStart
    onDragOver = onDragOver

    addBoard(row){
        this.store.dispatch(addBoard({key:row.key}))
    }

    archiveRow(key){
        this.store.dispatch(archiveRow({key}))
    }

    toggleEditDescription(row){
        this.isEditingDescription = !this.isEditingDescription;
    }

    toggleEditTitle(row){
        this.isEditingTitle = !this.isEditingTitle;
        // if(this.isEditingTitle === false){
        //     this.store.dispatch(editRowTitle({key:row.key, title:row.title}))
        // }
    }

    onDrop(e, row){
        let payload = onDrop(e, row);
        if(payload){
          this.store.dispatch(transferBoard({payload}));
        }
    }
    
}