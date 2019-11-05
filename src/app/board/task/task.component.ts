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
import { editTask, transferTask, scrollRowForward, scrollRowBackward } from 'src/app/store/app.actions';



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

    constructor(private store:Store<AppState>, public dialog:MatDialog){}

    dialogRef;
    ngOnInit(){
        if(this.task.isEditing){
            this.task.isInput = true; 
        }
        if(this.task.dialogOpen){
            this.dialogRef = this.dialog.open(TaskDialogComponent, 
                {
                    // id:'task-dialog',
                    panelClass:'task-dialog',
                    // backdropClass:'task-dialog',
                    data:this.task
                }
            )
        }
    }
    ngOnDestroy(){
        if(this.dialogRef)this.dialogRef.close()
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
        if(e.clientX > window.innerWidth -125 && e.target.getAttribute('class').includes('task')){
            this.store.dispatch(scrollRowForward())
        }   
        else if(e.clientX < 125 && e.target.getAttribute('class').includes('task')){
            this.store.dispatch(scrollRowBackward())
        }
    }

    openDialog(){
        if(!this.disableDialogOpening){
            this.dialogRef = this.dialog.open(TaskDialogComponent, 
                {
                    // id:'task-dialog',
                    panelClass:'task-dialog',
                    // backdropClass:'task-dialog',
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
            this.store.dispatch(editTask({task:this.task}))    
        }
        
    }

    changeTaskBody(e){
        if(e.code === 'Enter'){
            e.preventDefault()
            this.toggleInput()
        }
        else{
            this.task.body = e.target.value; 
        }
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

        // this.store.dispatch(editTask({task}))
    }

    onDrop(e){
        e.preventDefault();
        let transferedData = e.dataTransfer.getData('text');
        let payload = onDrop(transferedData, this.task)
        if(payload){
            this.store.dispatch(transferTask({payload}))
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











