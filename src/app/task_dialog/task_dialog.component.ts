import {Component, ViewChild, ElementRef, Inject} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Store, select } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { PreviewAttachmentDialogComponent} from './preview_attachment_dialog/preview_attachment_dialog.component';
import {AttachmentDialogComponent} from './attachment_dialog/attachment_dialog.component';
import {DatePickDialogComponent} from './date_pick_dialog/date_pick_dialog.component';
import {PhotoDialogComponent} from './photo_dialog/photo_dialog.component';
import {DeleteDialogComponent} from './delete_dialog/delete_dialog.component';

import {TransferTaskDialogComponent} from './transfer_task_dialog/transfer_task_dialog.component';
import { addLabel, addComment, addChecklist, deleteChecklist, changeChecklistTitle, toggleEditChecklistTitle, toggleChecklistItem, toggleEditChecklistItem, addChecklistItem, deleteChecklistItem, changeChecklistItemText, removeFile, deleteComment } from './task_dialog.logic';
import { editTask, closeTaskDialog, openTaskDialog, setSelectedTask, archiveTask } from 'src/app/store/app.actions';
import { selectBoardAndRowTitleFromTaskKey, selectSpecificTask, selectSelectedTask } from 'src/app/store/app.selector';
import { Observable } from 'rxjs';
import { LinkTaskDialogComponent } from './link_task_dialog/link_task_dialog.component';
import { HttpClient } from '@angular/common/http';
import { labelLength } from '../task/task.logic';
import { map, first } from 'rxjs/operators';



@Component({
    selector:'task-dialog',
    templateUrl:'task_dialog.component.html',
    styleUrls:['./task_dialog.component.css']
})

export class TaskDialogComponent {
    @ViewChild('bodyInput', {read: ElementRef, static:false}) bodyInput: ElementRef;
    @ViewChild('descriptionInput', {read: ElementRef, static:false}) descriptionInput: ElementRef;
    @ViewChild('checklistTitle', {read: ElementRef, static:false}) checklistTitle: ElementRef;
    @ViewChild('checklistInput', {read: ElementRef, static:false}) checklistInput: ElementRef;

    @ViewChild('autosize', {static:false}) autosize:CdkTextareaAutosize;

    isEditingBody = false;
    isEditingBodyFocused = false;

    isEditingDescription = false;
    isEditingDescriptionFocused = false;

    boardAndRowTitle$:Observable<any>;
    linkedTasks$ = [];

    commentContent = '';
    data$;

    constructor(
        private store:Store<any>,
        public dialog:MatDialog,
        public http:HttpClient
        ){}

        ngOnInit(){
            this.data$ = this.store.select(selectSelectedTask);
            this.store.pipe(
                select(selectSelectedTask),
                first(),
                map(val => val)
            ).subscribe(data => {
                this.boardAndRowTitle$ = this.store.select(selectBoardAndRowTitleFromTaskKey, data.boardKey)
                document.querySelector('#pageTitle').textContent = data.body
                document.querySelector('.cdk-global-overlay-wrapper:last-of-type').classList.add('dialogToBack')
            })
        }

        ngAfterViewChecked(){
            this.autofocusInput('isEditingBody', 'isEditingBodyFocused', 'bodyInput');
            this.autofocusInput('isEditingDescription', 'isEditingDescriptionFocused', 'descriptionInput');
        }

        ngOnDestroy(){
            setTimeout(() => {
                if(!document.querySelector('.task-dialog')){
                    document.querySelector('#pageTitle').textContent = 'AngularFundamentals'
                }
            }, 500)
        }
    
    autofocusInput(isEditingProperty, isFocused, inputElement){
        if(this[isEditingProperty] && !this[isFocused]){
            this[isFocused] = true;
            setTimeout((input = this[inputElement]) => {
                input.nativeElement.focus();
            }, 0)
        }
    }
    
    addLabel(labelColor, data){
        this.store.dispatch(editTask({task:addLabel(data, labelColor)}))
    }

    toggleInput(isEditing, isFocused, e, data){
        if(e){
            e.preventDefault();
        }

        if(this[isEditing]){
            this.store.dispatch(editTask({task:data}));
            this[isEditing] = false
            this[isFocused] = false;
        }
        else{
            this[isEditing] = true
        }
    }

    onBodyInputLoad(){
        this.bodyInput.nativeElement.focus()
    }
    
    onCloseDialog(data){
        this.store.dispatch(closeTaskDialog())
    }

    changeTaskProperty(property, value, delayDispatch, data){
        data[property] = value;
        if(!delayDispatch){
            this.store.dispatch(editTask({task:data}));
        }
    }

    changeCommentContent(e){
        this.commentContent = e.target.value;
    }
    addComment(data){
        this.store.dispatch(editTask({task:addComment(data, this.commentContent)}))
        this.commentContent = '';
    }
    deleteComment(data, comment){
        this.store.dispatch(editTask({task:deleteComment(data, comment.date)}))
    }

    addChecklist(data){
        this.store.dispatch(editTask({task:addChecklist(data)}))
    }

    deleteChecklist(checklist, data){
        this.store.dispatch(editTask({task:deleteChecklist(data, checklist)}))
    }

    toggleEditChecklistTitle(checklistKey, data){
        let result = toggleEditChecklistTitle(checklistKey, data)
        if(result.isEditing){
            setTimeout(() => this.checklistTitle.nativeElement.focus(), 0)
        }
        if(!result.isEditing){
            this.store.dispatch(editTask({task:result.data}))
        }
    }
    changeChecklistTitle(e, checklistKey, data){
        changeChecklistTitle(e.target.value, data, checklistKey);
    }

    onChecklistItemDragStart(e, item){
        e.dataTransfer.setData('text/plain', `{"itemKey":${item.key}, "checklistKey":${item.checklistKey}}`);
    }

    onChecklistItemDragOver(e){
        e.preventDefault();
    }

    onChecklistDrop(e, item, data){
        let droppedItemKeys = JSON.parse(e.dataTransfer.getData('text/plain'))
        if(droppedItemKeys.checklistKey === item.checklistKey){
            let modifiedChecklist = data.checklists.find(checklist => checklist.key === droppedItemKeys.checklistKey).content;
            let droppedItemIndex = modifiedChecklist.findIndex(item => droppedItemKeys.itemKey === item.key);
            let droppedOnItemIndex = modifiedChecklist.findIndex(val => val.key === item.key);
            let droppedItem = modifiedChecklist.splice(droppedItemIndex, 1);
            modifiedChecklist.splice(droppedOnItemIndex, 0, droppedItem[0]);

            this.store.dispatch(editTask({task:data}));
        }
    }


    toggleChecklistItem(e, checklistKey, item, data){
        let result = toggleChecklistItem(checklistKey, item, data);
        if(result){
            this.store.dispatch(editTask({task:result}))
        }
    }

    toggleEditChecklistItem(e, checklistKey, item, data){
        let result = toggleEditChecklistItem(checklistKey, item, data)
        if(result.isEditing){
            setTimeout(() => this.checklistInput.nativeElement.focus(), 0)
        }
        if(!result.isEditing){
            this.store.dispatch(editTask({task:result.data}))
        }
    }

    focusChecklistInput(e){
        // e.target.focus()
    }

    addChecklistItem(checklistKey, data){
        this.store.dispatch(editTask({task:addChecklistItem(checklistKey, data)}))
        setTimeout(() => this.checklistInput.nativeElement.focus(), 0)
    }
    
    changeChecklistItem(e, checklistKey, index, data, item){

        if(e.code === 'Delete'){ 
            this.store.dispatch(editTask({task:deleteChecklistItem(checklistKey, index, data)}))          
        }
        else if(e.code === 'Enter' && e.target.value !== ''){
            this.toggleEditChecklistItem(e, checklistKey, item, data)
            this.addChecklistItem(checklistKey, data)
        }
        else{
            // TODO: add debounce
            this.store.dispatch(editTask({task: changeChecklistItemText(checklistKey, index, e.target.value, data)}))
        }
    }
    
    openTaskDialog(value){
        this.store.dispatch(openTaskDialog());
        this.store.dispatch(setSelectedTask({task:value}))
    }


    openDialog(id, dialogData, taskData){
        let dialogComponent;
        switch(id){
            case 'delete-dialog':
                dialogComponent = DeleteDialogComponent;
                break;

            case 'date-pick-dialog':
                dialogComponent = DatePickDialogComponent;
                break;

            case 'photo-dialog':
                dialogComponent = PhotoDialogComponent;
                break;

            case 'attachment-dialog':
                dialogComponent = AttachmentDialogComponent;
                break;

            case 'preview-attachment-dialog':
                dialogComponent = PreviewAttachmentDialogComponent;
                break;

            case 'transfer-task-dialog':
                dialogComponent = TransferTaskDialogComponent;
                break;
            
            case 'link_task_dialog':
                dialogComponent = LinkTaskDialogComponent;
                break;
        }
        this.dialog.open(
            dialogComponent,
            {
                id,
                data: dialogData ? dialogData : taskData
            }
        );
    }

    removeFile(index, data){
        this.store.dispatch(editTask({task:removeFile(index, data)}))
    }

    getLinkedTaskInfo(taskKey:number, boardKey:number, index){
        return this.store.pipe(select(selectSpecificTask, ({taskKey, boardKey})))
    }

    labelLength = labelLength;

    changeLabelContent(e, label){
        label.text = e.target.value
    }

    saveLabelContent(data){
        this.store.dispatch(editTask({task:data}))
    }

    removeLabel(i, data){
        data.labels.splice(i, 1);
        this.store.dispatch(editTask({task:data}))        
    }

    archiveTask(data){
        this.store.dispatch(archiveTask({task:data}));
        this.dialog.closeAll();
    }

}