import {Component, ViewChild, ElementRef, Inject} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { PreviewAttachmentDialogComponent} from './preview_attachment_dialog/preview_attachment_dialog.component';
import * as moment from 'moment';
import {AttachmentDialogComponent} from './attachment_dialog/attachment_dialog.component';
import {DatePickDialogComponent} from './date_pick_dialog/date_pick_dialog.component';
import {PhotoDialogComponent} from './photo_dialog/photo_dialog.component';
import {DeleteDialogComponent} from './delete_dialog/delete_dialog.component';

import {TransferTaskDialogComponent} from './transfer_task_dialog/transfer_task_dialog.component';


@Component({
    selector:'task-dialog',
    templateUrl:'task_dialog.component.html',
    styleUrls:['./task_dialog.component.css']
})

// OnChanges, AfterViewChecked, AfterViewInit, AfterContentChecked, DoCheck
// implements AfterContentChecked, AfterViewChecked, AfterViewInit
export class TaskDialogComponent {
    @ViewChild('bodyInput', {read: ElementRef, static:false}) bodyInput: ElementRef;
    @ViewChild('descriptionInput', {read: ElementRef, static:false}) descriptionInput: ElementRef;
    @ViewChild('autosize', {static:false}) autosize:CdkTextareaAutosize;

    isEditingBody                   = false;
    isEditingBodyFocused            = false;

    isEditingDescription            = false;
    isEditingDescriptionFocused     = false;

    commentContent = ''

    row = null;

    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<TaskDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
        ){}

        ngOnChanges(){
            
        }

        ngOnInit(){
            
            this.store.dispatch({type:'GET_STATE', payload:''})
            
        }

        ngAfterViewChecked(){
            if( this.isEditingBody && !this.isEditingBodyFocused){
                this.isEditingBodyFocused = true;
                setTimeout((bodyInput = this.bodyInput) => {
                    bodyInput.nativeElement.focus();
                }, 0)
                
            }

            if( this.isEditingDescription && !this.isEditingDescriptionFocused){
                this.isEditingDescriptionFocused = true;
                setTimeout((descriptionInput = this.descriptionInput) => {
                    descriptionInput.nativeElement.focus();
                }, 0)
                
            }
        }
       
    addLabel(labelColor){
        console.log('BALLSACK')
        this.data.labels.push({background:labelColor, fontColor:'rgb(0,0,0)', text:''})
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    toggleEditBody(e?){
        if(e){
            console.log('ayyy')
            e.preventDefault();
        }
        if(this.isEditingBody){
            this.store.dispatch({type:'EDIT_TASK', payload:this.data})
            this.isEditingBody = false
            this.isEditingBodyFocused = false;
        }
        else{
            this.isEditingBody = true;
            console.log(this.bodyInput)
           
        }
    }

    toggleEditDescription(){
        if(this.isEditingDescription){
            this.store.dispatch({type:'EDIT_TASK', payload:this.data})
            this.isEditingDescription = false
            this.isEditingDescriptionFocused = false;
        }
        else{
            this.isEditingDescription = true;
            console.log(this.bodyInput)
        }
    }

    onBodyInputLoad(){
        console.log('hrm')
        this.bodyInput.nativeElement.focus()
    }
    
    onCloseDialog(){
        this.dialogRef.close();
    }

    changeTaskBody(e){
        this.data.body = e.target.value;
    }

    changeTaskDescription(e){
        this.data.description = e.target.value;
    }

    changeIsComplete(){
        this.data.isComplete = !this.data.isComplete;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    changeImportant(){
        this.data.important = !this.data.important;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    changeWarning(){
        this.data.warning = !this.data.warning;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    changePayment(){
        this.data.payment = !this.data.payment;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    changeVacation(){
        this.data.vacation = !this.data.vacation;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    changeSocial(){
        this.data.social = !this.data.social;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    changeTravel(){
        this.data.travel = !this.data.travel;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    changeWork(){
        this.data.work = !this.data.work;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    changeCommentContent(e){
        this.commentContent = e.target.value;
    }

    changeCardColor(color){
        this.data.cardColor = color;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }
    changeFontColor(color){
        this.data.fontColor = color;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    addChecklist(){
        this.data.checklists.push({
            title:{content:'New Checklist', isEditing:true},
            key:this.data.currentChecklistKey,
            color:'black',
            currentKey:1,
            completedTasks:0,
            content:[]
        })
        this.data.currentChecklistKey ++;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data});
    }

    deleteChecklist(checklist){
        let deletedChecklistIndex = this.data.checklists.findIndex(val => val.key === checklist.key)
        this.data.checklists.splice(deletedChecklistIndex, 1);
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }

    toggleEditChecklistTitle(checklistKey){
        let modifiedChecklist = this.data.checklists.find(checklist => checklist.key === checklistKey)
        modifiedChecklist.title.isEditing = !modifiedChecklist.title.isEditing;
        if(modifiedChecklist.title.isEditing === false)this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }
    changeChecklistTitle(e, checklistKey){
        let modifiedChecklist = this.data.checklists.find(checklist => checklist.key === checklistKey)
        modifiedChecklist.title.content = e.target.value;
    }

    toggleChecklistItem(e, checklistKey, item){
        let modifiedChecklist = this.data.checklists.find(checklist => checklist.key === checklistKey)
        let changedItemIndex  = modifiedChecklist.content.findIndex((val) => val.key === item.key)
        if(modifiedChecklist.content[changedItemIndex].content && !modifiedChecklist.content[changedItemIndex].isEditing){
            console.log(modifiedChecklist.content[changedItemIndex])

            modifiedChecklist.content[changedItemIndex].checked = !item.checked
            if(modifiedChecklist.content[changedItemIndex].checked){
                modifiedChecklist.completedTasks++;
            }
            else{
                modifiedChecklist.completedTasks--;
            }

            if(modifiedChecklist.completedTasks === modifiedChecklist.content.length){
                modifiedChecklist.color = 'green'
            }
            else{
                modifiedChecklist.color = 'black'
            }

            this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        }   
    }
    toggleEditChecklistItem(e, checklistKey, item){
        let modifiedChecklist = this.data.checklists.find(checklist => checklist.key === checklistKey)
        let changedItemIndex  = modifiedChecklist.content.findIndex((val) => val.key === item.key);
        if(modifiedChecklist.content[changedItemIndex].content){
            modifiedChecklist.content[changedItemIndex].isEditing = !item.isEditing;
        }
        
        if(item.isEditing === false){
            this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        }
    }

    focusChecklistInput(e){
        e.target.focus()
    }

    addChecklistItem(checklistKey){
        let modifiedChecklist = this.data.checklists.find(checklist => checklist.key === checklistKey)
        let taskKey = modifiedChecklist.currentKey = modifiedChecklist.currentKey +1;
        modifiedChecklist.content.push({key:taskKey, content:'', checked:false, isEditing:true})
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
    }
    changeChecklistItem(e, checklistKey, index){
        let modifiedChecklist = this.data.checklists.find(checklist => checklist.key === checklistKey)
        if(e.code === 'Delete'){
            let deletedTask = modifiedChecklist.content.splice(index, 1);
            console.log('DELETED TASK', deletedTask)
            if(deletedTask[0].checked){
                console.log('BROO')
                modifiedChecklist.completedTasks -= 1;
            }
            
            this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        }
        else if(e.code === 'Enter'){
            this.addChecklistItem(checklistKey)
        }
        else{
            modifiedChecklist.content[index].content= e.target.value;
        }
    }

    addComment(){
        this.data.comments.push({content:this.commentContent, date: moment().format('dddd, MMMM Do YYYY, h:mm:ss a')})
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        this.commentContent = '';
    }

    deleteTask(){
        const dialogRef = this.dialog.open(DeleteDialogComponent, 
            {
                id:'delete-dialog',
                data:this.data
            }
        )

        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.onCloseDialog();
                this.store.dispatch({type:'DELETE_TASK', payload:this.data})
            }
        })
        
    }

    openDatePicker(){
        const dialogRef = this.dialog.open(DatePickDialogComponent, 
            {
                id:'date-pick-dialog',
                data:this.data,
                maxWidth:'500px'
            }
        )
    }

    addPhotos(){
        const dialogRef = this.dialog.open(PhotoDialogComponent, 
            {
                id:'photo-dialog',
                data:this.data
            }
        )
    }

    attachItem(){
        const dialogRef = this.dialog.open(AttachmentDialogComponent, 
            {
                id:'attachment-dialog',
                data:this.data
            }
        )

        dialogRef.afterClosed().subscribe(result => {
            
        })
    }

    removeFile(index){
        this.data.downloadLinks.splice(index, 1);
        this.data.downloadNames.splice(index, 1);
        this.store.dispatch({type:'EDIT_TASKS', payload:this.data})
    }
    previewAttachment(downloadLink){
        console.log(downloadLink)
        const dialogRef = this.dialog.open(PreviewAttachmentDialogComponent, 
            {
                id:'preview-attachment-dialog',
                data:downloadLink
            }
        )
    }

    transferTask(){
        const dialogRef = this.dialog.open(TransferTaskDialogComponent, 
            {
                id:'transfer-task-dialog',
                data:this.data
            }
        )
    }

}