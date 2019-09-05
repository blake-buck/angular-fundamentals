import {Component, Input, Output, EventEmitter, Injectable, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';
import {Store, select} from '@ngrx/store';
import {addTask} from './board.actions'
import {Observable} from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

export interface AppState{
    simpleReducer:any
}

@Component({
    selector:'board',
    templateUrl:'board.component.html',
    styleUrls:['./board.component.css']
})

@Injectable()

export class BoardComponent implements OnInit{
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

    constructor(private store:Store<AppState>, public dialog:MatDialog, private sanitization:DomSanitizer,){
       
        this.board$ = this.store.select(state => state.simpleReducer.boards.find((board) => board.key === this.boardKey))
    }

    ngAfterViewChecked(){
        if(this.isEditingBoardTitle && !this.isEditingBoardTitleFocused){
            this.isEditingBoardTitleFocused = true;
            setTimeout(() => {
                this.boardTitleInput.nativeElement.focus();
            }, 0)
        }
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
        console.log('BOARD DROP')
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

    ngOnInit(){
        this.store.dispatch({type:'GET_STATE', payload:''})
        
    }

    toggleHideCompleteTasks(boardKey, hideCompleteTasks){
        console.log(`BOARDKEY:${boardKey}`)
        this.store.dispatch({type:'TOGGLE_HIDE_COMPLETE_TASKS', payload:{boardKey, hideCompleteTasks}})
    }
   
    onDragStart(e, board){
        // console.log()
        
        
        if(e.dataTransfer.getData('text').includes('+')){

        }
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
        // console.log(e.target.files[0])
        // let file = e.target.files[e.target.files.length-1];
        if(file){
            fileReader.readAsDataURL(file)
        }
    }

    downloadLinkLoads(){
        console.log('MY NAME IS JEFF')
        // this seems very hacky, should probably find another way to prevent ExpressionChangedAfter error message
        setTimeout(() => {
            this.displayExportLink = false
        }, 0)
        
    }


    

    orderByDateCreated(tasks, boardKey){
        let orderedArray = tasks.slice(0, tasks.length+1)
       
        for(let i=0; i< tasks.length; i++){
            for(let j=i; j < tasks.length; j++){

                if(orderedArray[j].dateCreated.isBefore(orderedArray[i].dateCreated)){
                    
                    let placeholder = orderedArray[i];

                    orderedArray[i] = orderedArray[j];
                    orderedArray[j] = placeholder;
                }

            }
        }

        this.store.dispatch({type:"REORDER_BOARD_TASKS", payload:{
            key:boardKey,
            tasks:orderedArray
        }})
        
    }

    orderByLastEdited(tasks, boardKey){
        let orderedArray = tasks.slice(0, tasks.length + 1);

        for(let i=0; i < orderedArray.length; i++){
            for(let j=i; j<orderedArray.length; j++){
                if(orderedArray[j].lastEdited.isAfter(orderedArray[i].lastEdited)){
                    let placeholder = orderedArray[i];
                    orderedArray[i] = orderedArray[j];
                    orderedArray[j] = placeholder;
                }
            }
        }
        this.store.dispatch({type:"REORDER_BOARD_TASKS", payload:{
            key:boardKey,
            tasks:orderedArray
        }})
    }

    // for now this system only goes out to 6 letters in a board body -- not perfect but good enough for now

    orderByAlphabetical(tasks, boardKey){
        console.time()
        
        let reorganizedBoard = [];
        let orderedArray = tasks.slice(0, tasks.length + 1);

        tasks.map(val => {
            reorganizedBoard.push(this.turnStringIntoNumber(val.body));
        })

        
        // for(let i=0; i< orderedArray.length; i++){
            
        //     for(let j=i; j<orderedArray.length; j++){
        //         if(reorganizedBoard[j] < reorganizedBoard[i]){
        //             let placeholder = orderedArray[i]
        //             orderedArray[i]=orderedArray[j];
        //             orderedArray[j] = placeholder;
        //             orderedArray = orderedArray
        //         }
        //     }
        // }

        for(let i=0; i< orderedArray.length; i++){
            
            for(let j=i; j<orderedArray.length; j++){
                if(reorganizedBoard[j] < reorganizedBoard[i]){
                    let placeholder = orderedArray[i]
                    orderedArray[i]=orderedArray[j];
                    orderedArray[j] = placeholder;

                    placeholder = reorganizedBoard[i]
                    reorganizedBoard[i] = reorganizedBoard[j];
                    reorganizedBoard[j] = placeholder;
                    i=0;
                    j=0;
                }
            }
        }
           

        
        console.timeEnd()

        console.log(orderedArray)
        this.store.dispatch({type:"REORDER_BOARD_TASKS", payload:{key:boardKey, tasks:orderedArray}})
    }

    turnStringIntoNumber(text){
        let characterArray = text.split('');
        let number = 0;
        for(let i=0; i<6 && i<characterArray.length; i++){
            number += this.turnCharacterIntoNumber(characterArray[i]) * (Math.pow(10, (-1*(i*2))))
        }
        return number
    }

    turnCharacterIntoNumber(character){
        let char= character.toUpperCase().charCodeAt(0);
        if(char <65 || char >92){
            return 1
        }
        return char;
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

@Component({
    templateUrl:'./transfer_board_dialog.component.html',
    selector:'transfer-board-dialog'
})

export class TransferBoardDialogComponent{

    rows$:Observable<any>
    selectedRow = null;

    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<TransferBoardDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){
        this.rows$ = this.store.select(state => state.simpleReducer.rows)
    }

    onCloseDialog(){
        this.dialogRef.close();
    }

    transferBoard(data){
        // {draggedBoardKey,droppedOnBoardKey,draggedBoardRowKey,droppedOnRowKey
        this.store.dispatch({type:'TRANSFER_BOARD', payload:{draggedBoardKey:data.key, draggedBoardRowKey:data.rowKey, droppedOnRowKey:this.selectedRow.key}})
        this.dialogRef.close();
    }

}