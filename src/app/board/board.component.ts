import {Component, Input, Output, EventEmitter, Injectable, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';
import {Store, select} from '@ngrx/store';

import {Observable} from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import {orderByLastEdited, orderByAlphabetical, orderByDateCreated, onDrop} from './board.logic';
import {editBoardTitle, archiveBoard, deleteBoard, toggleHideCompleteTasks, addTask, editTask, reorderBoardTasks, duplicateBoard} from '../store/app.actions'
import { selectRows, selectBoards, selectBoardFromBoardKey } from '../store/app.selector';


@Component({
    selector:'board',
    templateUrl:'board.component.html',
    styleUrls:['./board.component.css']
})

@Injectable()

export class BoardComponent{
    @ViewChild('boardTitleInput', {read: ElementRef, static:false}) boardTitleInput: ElementRef;
    
    @Input() boardTitle:string;
    @Input() boardKey:any;

    @Output() autoScroller = new EventEmitter();

    isEditingBoardTitle = false;
    isEditingBoardTitleFocused = false;
    exportLink = null;
    displayExportLink = false;
    

    tasks$:Observable<any>
    board$:Observable<any>

    titles:any=[]

    constructor(private store:Store<any>, public dialog:MatDialog, private sanitization:DomSanitizer,){
        // this.board$ = this.store.select(state => state.simpleReducer.boards.find((board) => board.key === this.boardKey))
    }

   ngOnInit(){
       this.board$ = this.store.pipe(select(selectBoardFromBoardKey, this.boardKey))
   }

    ngAfterViewChecked(){
        if(this.isEditingBoardTitle && !this.isEditingBoardTitleFocused){
            this.isEditingBoardTitleFocused = true;
            setTimeout(() => {
                this.boardTitleInput.nativeElement.focus();
            }, 0)
        }
    }

    archiveBoard(board){
        this.store.dispatch(archiveBoard({key:board.key}))
        // this.store.dispatch({type:'ARCHIVE_BOARD', payload:{key:board.key}})
    }

    addTask(){
        this.store.dispatch(addTask({key:this.boardKey}))
    }

    onTaskChange(changedTask){
        this.store.dispatch(editTask({task:changedTask}))
    }
    
    onDrop(e, board){
        let eventDataTransfer = e.dataTransfer.getData('text')
        e.preventDefault()
        let state = onDrop(eventDataTransfer, board, this.boardKey);
        if(state){
            this.store.dispatch({type:state.type, payload:state.payload})
        }
        
    }

    // duplicateBoard(board){
    //     this.store.dispatch(duplicateBoard({key:board.key}))
    // }

    toggleEditBoardTitle(board){
        if(this.isEditingBoardTitle){
            this.store.dispatch(editBoardTitle({key:board.key, title:board.title}))
        }
        this.isEditingBoardTitle = !this.isEditingBoardTitle;
        if(this.isEditingBoardTitleFocused){
            this.isEditingBoardTitleFocused = false;
        }
    }
    editBoardTitle(e, board){  
        if(e.code === 'Enter'){
            this.toggleEditBoardTitle(board)
        }
        else{
            board.title = e.target.value;
        }
    }

    toggleHideCompleteTasks(key, hideCompleteTasks){
        this.store.dispatch(toggleHideCompleteTasks({key, hideCompleteTasks}))
        // this.store.dispatch({type:'TOGGLE_HIDE_COMPLETE_TASKS', payload:{boardKey, hideCompleteTasks}})
    }
   
    onDragStart(e, board){
        if(e.dataTransfer.getData('text').includes('+')){}
        else{
            e.dataTransfer.setData('text/plain', `BOARD${board.key}-${board.rowKey}`);
        }
        
    }

    onDrag(e){
        // if(e.pageX > window.screenX -800){
        //     this.autoScroller.emit({forward:true, offset:e.clientX})
        // }
        // else if(200 > e.pageX){
        //     this.autoScroller.emit({forward:false, offset:e.clientX})
        // }
    }

    taskAutoScroll(e){
        this.autoScroller.emit({forward:true, offset:e.clientX})
    }

    onDragOver(e, board){
        e.preventDefault()
    }

    deleteBoard(boardKey){
        const dialogRef = this.dialog.open(DeleteBoardDialogComponent, 
            {
                id:'delete-board-dialog',
                data:boardKey
            }
        )
    }

    transferBoard(data){
        const dialogRef = this.dialog.open(TransferBoardDialogComponent, 
            {
                id:'transfer-board-dialog',
                data:data
            }
        )
    }

    
    exportBoard(board){
        let file = new File([JSON.stringify(board)], board.title)
        
        let fileReader = new FileReader();

        fileReader.onloadend = (e) => {
            let untrustedLink:any = fileReader.result
            this.exportLink = this.sanitization.bypassSecurityTrustUrl(untrustedLink);
            this.displayExportLink = true;
        }
        if(file){
            fileReader.readAsDataURL(file)
        }
    }

    downloadLinkLoads(){
        // this seems very hacky, should probably find another way to prevent ExpressionChangedAfter error message
        setTimeout(() => {
            this.displayExportLink = false
        }, 0)
        
    }

    orderByDateCreated(tasks, key){
        this.store.dispatch(reorderBoardTasks({payload:{key, tasks:orderByDateCreated(tasks)}}))
    }

    orderByLastEdited(tasks, key){
        this.store.dispatch(reorderBoardTasks({payload:{key, tasks:orderByLastEdited(tasks)}}))
    }

    // for now this system only goes out to 6 letters in a board body -- not perfect but good enough for now

    orderByAlphabetical(tasks, key){
        this.store.dispatch(reorderBoardTasks({payload:{key, tasks:orderByAlphabetical(tasks)}}))
    }

}

@Component({
    templateUrl:'./delete_board_dialog.component.html',
    selector:'delete-board-dialog'
})

export class DeleteBoardDialogComponent{
    constructor(
        private store:Store<any>,
        public dialogRef: MatDialogRef<DeleteBoardDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    onCloseDialog(){
        this.dialogRef.close();
    }

    

    deleteBoard(){
        this.store.dispatch(deleteBoard({key:this.data}))
        this.dialogRef.close();
    }
}

@Component({
    templateUrl:'./transfer_board_dialog.component.html',
    selector:'transfer-board-dialog'
})

export class TransferBoardDialogComponent{

    rows$:Observable<any>
    boards$;
    selectedRow = null;

    constructor(
        private store:Store<any>,
        public dialogRef: MatDialogRef<TransferBoardDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){
        this.rows$ = this.store.select(selectRows)
        this.boards$ = this.store.select(selectBoards)
    }

    onCloseDialog(){
        this.dialogRef.close();
    }

    transferBoard(data){
        this.store.dispatch({type:'TRANSFER_BOARD', payload:{draggedBoardKey:data.key, draggedBoardRowKey:data.rowKey, droppedOnRowKey:this.selectedRow.key}})
        this.dialogRef.close();
    }

}