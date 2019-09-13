import {Component, ViewChild, ElementRef, Inject} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { PreviewAttachmentDialogComponent} from './preview_attachment_dialog/preview_attachment_dialog.component';
import {AttachmentDialogComponent} from './attachment_dialog/attachment_dialog.component';
import {DatePickDialogComponent} from './date_pick_dialog/date_pick_dialog.component';
import {PhotoDialogComponent} from './photo_dialog/photo_dialog.component';
import {DeleteDialogComponent} from './delete_dialog/delete_dialog.component';

import {TransferTaskDialogComponent} from './transfer_task_dialog/transfer_task_dialog.component';
import { addLabel, addComment, changeCardColor, changeFontColor, addChecklist, deleteChecklist, changeChecklistTitle, toggleEditChecklistTitle, toggleChecklistItem, toggleEditChecklistItem, addChecklistItem, deleteChecklistItem, changeChecklistItemText, removeFile } from './task_dialog.logic';


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
        this.store.dispatch({type:'EDIT_TASK', payload:addLabel(this.data, labelColor)})
    }

    toggleEditBody(e?){
        if(e){
            e.preventDefault();
        }

        if(this.isEditingBody){
            this.store.dispatch({type:'EDIT_TASK', payload:this.data})
            this.isEditingBody = false
            this.isEditingBodyFocused = false;
        }
        else{
            this.isEditingBody = true;
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
        }
    }

    onBodyInputLoad(){
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
    addComment(){
        this.store.dispatch({type:'EDIT_TASK', payload:addComment(this.data, this.commentContent)})
        this.commentContent = '';
    }

    changeCardColor(color){
        this.store.dispatch({type:'EDIT_TASK', payload:changeCardColor(this.data, color)})
    }
    changeFontColor(color){
        this.store.dispatch({type:'EDIT_TASK', payload:changeFontColor(this.data, color)})
    }

    addChecklist(){
        this.store.dispatch({type:'EDIT_TASK', payload:addChecklist(this.data)});
    }

    deleteChecklist(checklist){
        this.store.dispatch({type:'EDIT_TASK', payload:deleteChecklist(this.data, checklist)})
    }

    toggleEditChecklistTitle(checklistKey){
        let result = toggleEditChecklistTitle(checklistKey, this.data)
        if(!result.isEditing){
            this.store.dispatch({type:'EDIT_TASK', payload:result.data})
        }
    }
    changeChecklistTitle(e, checklistKey){
        changeChecklistTitle(e.target.value, this.data, checklistKey);
    }

    toggleChecklistItem(e, checklistKey, item){
        let result = toggleChecklistItem(checklistKey, item, this.data);
        if(result){
            this.store.dispatch({type:'EDIT_TASK', payload:result})
        }
    }

    toggleEditChecklistItem(e, checklistKey, item){
        let result = toggleEditChecklistItem(checklistKey, item, this.data)
        if(!result.isEditing){
            this.store.dispatch({type:'EDIT_TASK', payload:result.data})
        }
    }

    focusChecklistInput(e){
        e.target.focus()
    }

    addChecklistItem(checklistKey){
        this.store.dispatch({type:'EDIT_TASK', payload:addChecklistItem(checklistKey, this.data)})
    }
    
    changeChecklistItem(e, checklistKey, index){
        if(e.code === 'Delete'){            
            this.store.dispatch({type:'EDIT_TASK', payload:deleteChecklistItem(checklistKey, index, this.data)})
        }
        else if(e.code === 'Enter'){
            this.addChecklistItem(checklistKey)
        }
        else{
            this.data = changeChecklistItemText(checklistKey, index, e.target.value, this.data)
        }
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
        this.store.dispatch({type:'EDIT_TASKS', payload:removeFile(index, this.data)})
    }
    previewAttachment(downloadLink){
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