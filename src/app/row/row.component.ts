import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';

import { onDragStart, onDragOver, onDrop } from './row.logic';

import { archiveRow, editRowTitle, editRowDescription, addBoard, transferBoard, scrollRowForward, scrollRowBackward, editRowExpanded, shiftRowUp, shiftRowDown, deleteRow } from '../store/app.actions';
import { selectSpecificBoards } from '../store/app.selector';
import { Actions } from '@ngrx/effects';

export interface AppState{
    appReducer:any
}

@Component({
    templateUrl:'./row.component.html',
    selector:'row',
    styleUrls:['./row.component.css']
})

export class RowComponent{
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

    archiveRow(archivedRow){
        this.store.dispatch(archiveRow({archivedRow}))
    }

    toggleEditDescription(row){
        this.isEditingDescription = !this.isEditingDescription;
    }

    toggleEditTitle(row){
        this.isEditingTitle = !this.isEditingTitle;
    }

    onDrop(e, row){
        let payload = onDrop(e, row);
        if(payload){
          this.store.dispatch(transferBoard({payload}));
        }
    }

    openRow(){
        if(!this.rowData.expanded){
            this.store.dispatch(editRowExpanded({key:this.rowData.key, expanded:true}));
        }
    }

    closeRow(){
        if(this.rowData.expanded){
            this.store.dispatch(editRowExpanded({key:this.rowData.key, expanded:false}));
        }
    }

    shiftRowDown(row){
        this.store.dispatch(shiftRowDown({position:row.position}))
    }

    shiftRowUp(row){
        this.store.dispatch(shiftRowUp({position:row.position}))
    }

    deleteRow(row){
        this.store.dispatch(deleteRow({deletedRow:row}))
    }
}