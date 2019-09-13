import { DomSanitizer} from '@angular/platform-browser'
import {Component, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, 
    OnChanges, AfterViewChecked, AfterViewInit, AfterContentChecked, DoCheck} from '@angular/core';
import { CdkTextColumn } from '@angular/cdk/table';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Store} from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';

import {addCompletionStyling, onDrop, labelLength, cyclePhoto} from './task.logic';
export interface AppState{
    simpleReducer:any
}



import {TaskDialogComponent} from './task_dialog/task_dialog.component';



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

    isTaskTitleInputFocused = false;
    displayLabelText = false;
    disableDialogOpening = false;

    currentDisplayPhoto = 0;
    classAddedToList = false

    constructor(private store:Store<AppState>, public dialog:MatDialog){
        
    }

    ngOnInit(){
        if(this.task.isEditing){
            this.task.isInput = true; 
        }
    }

    ngAfterViewChecked(){
        if(this.task.isInput && !this.isTaskTitleInputFocused){
            this.isTaskTitleInputFocused = true;
            setTimeout(() => {
                this.taskBodyInput.nativeElement.focus()
            }, 0)
            
        }

        if(this.task.displayImageUrls.length === 1){   
            setTimeout(() => {
                this.currentDisplayPhoto = 0;
            }, 0)
        }
    }

    disableDialogOpen(){
        this.disableDialogOpening = true;
        setTimeout(() => {
            this.disableDialogOpening = false;
        }, 500)
    }

    onDrag(e){
        // if(e.pageX > window.screenX -800){
        //     this.autoScroller.emit({forward:true, offset:e.clientX})
        // }
        // else if(200 > e.pageX){
        //     this.autoScroller.emit({forward:false, offset:e.clientX})
        // }
    }

    openDialog(){
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
            this.store.dispatch({type:'EDIT_TASK', payload:this.task})            
        }
        
    }

    changeTaskBody(e){
        this.task.body = e.target.value; 
    }

    toggleDisplayLabelText(){
        this.disableDialogOpen()
        this.displayLabelText = !this.displayLabelText;  
    }

    cyclePhoto(isForward, displayImageUrls){
        this.disableDialogOpen()
        this.currentDisplayPhoto = cyclePhoto(isForward, displayImageUrls, this.currentDisplayPhoto)
    }

    focusLabel(){
        this.disableDialogOpen()
    }

    labelLength = labelLength;

    changeLabelText(e, labelIndex, task){
        this.labelLength(e.target.value.length)
        task.labels[labelIndex].text = e.target.value;

        this.store.dispatch({type:'EDIT_TASK', payload:task})
    }

    onDrop(e){
        e.preventDefault();
        let transferedData = e.dataTransfer.getData('text');
        let payload = onDrop(transferedData, this.task)
        if(payload){
            this.store.dispatch({type:'TRANSFER_TASK', payload:payload})
        }
                
    }

    onDragOver(e){
        // e.preventDefault();
    }

    onDragStart(e){
        e.dataTransfer.setData('text/plain', `${this.task.key}+${this.task.boardKey}`);
    }

    onDragEnd(e){
        e.preventDefault()
    }
    
    addCompletionStyling(property){
        return addCompletionStyling(property, this.task)
    }

}











