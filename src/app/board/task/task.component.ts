import { DomSanitizer} from '@angular/platform-browser'
import {Component, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, 
    OnChanges, AfterViewChecked, AfterViewInit, AfterContentChecked, DoCheck} from '@angular/core';
import { CdkTextColumn } from '@angular/cdk/table';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Store} from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';
export interface AppState{
    simpleReducer:any
}

import * as moment from 'moment';
import { ReadVarExpr } from '@angular/compiler';
import { Observable } from 'rxjs';

import {TaskDialogComponent} from './task_dialog/task_dialog.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
    selector:'task',
    templateUrl:'task.component.html',
    styleUrls:['./task.component.css']
})



export class TaskComponent{
    @ViewChild('elementWrapper', {read: ElementRef, static:false}) elementWrapper: ElementRef;
    @ViewChild('taskBodyInput', {read: ElementRef, static:false}) taskBodyInput: ElementRef;

    @Input() task:any;
    @Input() board:any;

    @Output() taskTransfer = new EventEmitter();
    @Output() taskChange   = new EventEmitter();
    
    @Output() autoScroller = new EventEmitter();


    constructor(private store:Store<AppState>, public dialog:MatDialog){
        
    }

    ngOnInit(){
        if(this.task.isEditing){
            this.task.isInput = true; 
        }
        
    }

    isTaskTitleInputFocused = false;
    displayLabelText = false;
    disableDialogOpening = false;

    currentDisplayPhoto = 0;

    ngAfterViewInit(){
        
        
    }
    ngAfterViewChecked(){
        if(this.task.isInput && !this.isTaskTitleInputFocused){
            this.isTaskTitleInputFocused = true;
            setTimeout(() => {
                this.taskBodyInput.nativeElement.focus()
            }, 0)
            
        }

        if(this.task.displayImageUrl.length === 1){
            
            setTimeout(() => {
                this.currentDisplayPhoto = 0;
            }, 0)
        }
    }

    classAddedToList = false

    onDrag(e){
        if(e.pageX > window.screenX -800){
            this.autoScroller.emit({forward:true, offset:e.clientX})
        }
        else if(200 > e.pageX){
            this.autoScroller.emit({forward:false, offset:e.clientX})
        }
    }

    openDialog(){
        console.log('OPEN DIALOG')
        if(!this.disableDialogOpening){
            const dialogRef = this.dialog.open(TaskDialogComponent, 
                {
                    
                    id:'task-dialog',
                    data:this.task
                }
            )
        }
        
    }

    toggleInput(e?){
        if(e){
            e.preventDefault();
        }
        if(!this.task.isComplete){
            if(this.task.isInput){
                this.isTaskTitleInputFocused = false;
                this.task.isEditing= false;
            }
            this.task.isInput = !this.task.isInput;
            
            this.taskChange.emit(this.task);
            
        }
        
    }

    changeTaskBody(e){
        
        this.task.body = e.target.value; 
    }

    toggleDisplayLabelText(){
        this.disableDialogOpening = true;
        this.displayLabelText = !this.displayLabelText;
        setTimeout(() => {
            this.disableDialogOpening = false;
        }, 500)
    }

    cyclePhoto(isForward, displayImageUrl){
        this.disableDialogOpening = true;
        if(isForward && this.currentDisplayPhoto < displayImageUrl.length -1){
            this.currentDisplayPhoto ++;
        }
        else if(isForward && this.currentDisplayPhoto === displayImageUrl.length - 1){
            this.currentDisplayPhoto = 0;
        }
        else if(!isForward && this.currentDisplayPhoto === 0){
            this.currentDisplayPhoto = displayImageUrl.length - 1;
        }
        else{
            this.currentDisplayPhoto --;
        }
        setTimeout(() => {
            this.disableDialogOpening = false;
        }, 500)
    }

    focusLabel(){
        this.disableDialogOpening = true;
        setTimeout(() => {
            this.disableDialogOpening = false;
        }, 500)
    }

    labelLength(labelLength){
        if(labelLength < 4){
            return 2
        }
        return labelLength -2;
    }

    changeLabelText(e, labelIndex, task){
        this.labelLength(e.target.value.length)
        task.labels[labelIndex].text = e.target.value;
        console.log(task)
        this.store.dispatch({type:'EDIT_TASK', payload:task})
    }

    onDrop(e){
        console.log('TASK DROP')
        e.preventDefault();
        
        let transferedData = e.dataTransfer.getData('text');
        if(transferedData.includes('+')){
            transferedData = transferedData.split('+')
            let droppedTaskId = +transferedData[0];
            let droppedTaskBoard = +transferedData[1];

            let droppedOnTaskId = this.task.key;
            let droppedOnTaskBoard = this.task.boardKey;

            console.log({droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard})
            this.taskTransfer.emit({droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard});
            this.store.dispatch({type:'TRANSFER_TASK', payload:{droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard}})
        }
        
        
    }

    onDragOver(e){
        // e.preventDefault();
    }

    onDragStart(e){
        console.log('TASK DRAGGING')
        e.dataTransfer.setData('text/plain', `${this.task.key}+${this.task.boardKey}`);
    }

    onDragEnd(e){
        e.preventDefault()
    }
    
    addCompletionStyling(property){
        if(this.task.isComplete && property === 'opacity'){
            return '.5'
        }
        else if(this.task.isComplete && property === 'text-decoration'){
            return 'line-through'
        }
        else{
            return ''
        }
    }

}











