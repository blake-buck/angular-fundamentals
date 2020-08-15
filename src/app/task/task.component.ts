import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {Store} from '@ngrx/store';
import { MatDialog} from '@angular/material';

import {addCompletionStyling, onDrop, labelLength, cyclePhoto} from './task.logic';
export interface AppState{
    appReducer:any
}

import {TaskDialogComponent} from '../task_dialog/task_dialog.component';
import { editTask, transferTask, scrollRowForward, scrollRowBackward, setSelectedTask, openTaskDialog } from 'src/app/store/app.actions';

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
        const startScrollingBoundary = 125;
        const elementHasTaskAttribute = e.target.getAttribute('class').includes('task');
        if(e.clientX > window.innerWidth - startScrollingBoundary && elementHasTaskAttribute){
            this.store.dispatch(scrollRowForward())
        }   
        else if(e.clientX < startScrollingBoundary && elementHasTaskAttribute){
            this.store.dispatch(scrollRowBackward())
        }
    }

    openDialog(){
        if(!this.disableDialogOpening){
            this.store.dispatch(openTaskDialog());
            this.store.dispatch(setSelectedTask({task:this.task}));
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