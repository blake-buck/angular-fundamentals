import {Component, Input, Output, EventEmitter, Injectable, Inject, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';
import {Store, select} from '@ngrx/store';
import {addTask} from './board.actions'
import {Observable} from 'rxjs';

export interface AppState{
    simpleReducer:any
}

@Component({
    selector:'board',
    templateUrl:'board.component.html'
})

@Injectable()

export class BoardComponent implements OnInit{
    @Input() boardTitle:string;
    @Input() boardKey:any;

    @Output() changeBoardTitle = new EventEmitter();

    isEditingBoardTitle = false;

    tasks$:Observable<any>
    board$:Observable<any>

    constructor(private store:Store<AppState>, public dialog:MatDialog){
        this.tasks$ = this.store.select(state => state.simpleReducer.tasks)
        this.board$ = this.store.select(state => state.simpleReducer.boards.find((board) => board.key === this.boardKey))
    }

    
    titles:any=[]

    archiveBoard(board){
        this.store.dispatch({type:'ARCHIVE_BOARD', payload:{key:board.key}})
    }

    addTask(){
        this.store.dispatch({type:'ADD_TASK', payload:{key:2, boardKey:this.boardKey, body:'', isEditing:false}})
    }

    onTaskChange(changedTask){
        this.store.dispatch({type:'EDIT_TASK', payload:changedTask})
    }
    
    onTaskTransfer(e){
        console.log(e)
        
        // let draggedIndex = this.tasks.findIndex((task)=> task.key === e.droppedTaskId) 
        // let droppedIndex = this.tasks.findIndex((task)=> task.key === e.droppedOnTaskId);

        // let addedItem = Object.create(this.tasks[draggedIndex])
        // this.tasks.splice(draggedIndex, 1);
        // this.tasks.splice(droppedIndex, 0,  addedItem)
    }

    onDrop(e, board){
        let eventDataTransfer = e.dataTransfer.getData('text')
        if((board.tasks.length === 0 || board.tasks.filter(task => !task.isComplete).length === 0) && eventDataTransfer.includes('+')){
            e.preventDefault()
            let transferedData = eventDataTransfer.split('+')
            let droppedTaskId    = +transferedData[0];
            let droppedTaskBoard = +transferedData[1];

            this.store.dispatch({type:'TRANSFER_TASK_EMPTY', payload:{droppedTaskId, droppedTaskBoard, droppedOnTaskBoard:this.boardKey}})
           
        }
        else if(eventDataTransfer.includes('BOARD')){
            console.log(eventDataTransfer)
            let unSanitizedKeys = eventDataTransfer.replace('BOARD', '');
            let keyArray = unSanitizedKeys.split('-')
            let droppedOnBoardKey = board.key;
            this.store.dispatch({type:'TRANSFER_BOARD', payload:{draggedBoardKey:+keyArray[0], draggedBoardRowKey:+keyArray[1], droppedOnBoardKey, droppedOnRowKey:board.rowKey}})
        }
    }

    toggleEditBoardTitle(board){
        if(this.isEditingBoardTitle){
            this.store.dispatch({type:'EDIT_BOARD_TITLE', payload:{key:board.key, title:board.title}})
        }
        this.isEditingBoardTitle = !this.isEditingBoardTitle;
        
    }
    editBoardTitle(e, board){
        board.title = e.target.value;
    }

    ngOnInit(){
        this.store.dispatch({type:'GET_STATE', payload:''})
    }

    toggleHideCompleteTasks(boardKey, hideCompleteTasks){
        console.log(`BOARDKEY:${boardKey}`)
        this.store.dispatch({type:'TOGGLE_HIDE_COMPLETE_TASKS', payload:{boardKey, hideCompleteTasks}})
    }
   
    onDragStart(e, board){
        console.log()
        
        
        if(e.dataTransfer.getData('text').includes('+')){

        }
        else{
            e.dataTransfer.setData('text/plain', `BOARD${board.key}-${board.rowKey}`);
        }
        
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

}

@Component({
    templateUrl:'./delete_board_dialog.component.html',
    selector:'delete-board-dialog'
})

export class DeleteBoardDialogComponent{
    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<DeleteBoardDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    onCloseDialog(){
        this.dialogRef.close();
    }

    

    deleteBoard(){
        this.store.dispatch({type:'DELETE_BOARD', payload:this.data})
        this.dialogRef.close();
    }
}