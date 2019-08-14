import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

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
        this.store.dispatch({type:'GET_STATE', payload:''})
        console.log(window.innerWidth)
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

    onDragStart(e, rowKey){
        e.dataTransfer.setData('text/plain', `ROW${rowKey}`);
        console.log(`ROW${rowKey}`)
    }

    onDragOver(e){
        e.preventDefault();
    }

    autoScroller(e){
            
        if(e.forward){          
            this.scrollRow.nativeElement.scrollBy({left:10, top:0, behavior:'auto' })
        }
        else{
            this.scrollRow.nativeElement.scrollBy({left:-10, top:0, behavior:'auto' })
        }
   
    }

    
}