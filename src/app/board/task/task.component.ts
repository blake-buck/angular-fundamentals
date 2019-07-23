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


@Component({
    selector:'task',
    templateUrl:'task.component.html'
})



export class TaskComponent{
    @ViewChild('elementWrapper', {read: ElementRef, static:false}) elementWrapper: ElementRef;
    @ViewChild('taskBodyInput', {read: ElementRef, static:false}) taskBodyInput: ElementRef;

    @Input() task:any;
    @Input() board:any;

    @Output() taskTransfer = new EventEmitter();
    @Output() taskChange   = new EventEmitter();
    


    constructor(private store:Store<AppState>, public dialog:MatDialog){
        
    }

    isTaskTitleInputFocused = false;

    ngAfterViewChecked(){
        if(this.task.isInput && !this.isTaskTitleInputFocused){
            this.isTaskTitleInputFocused = true;
            setTimeout(() => {
                this.taskBodyInput.nativeElement.focus()
            }, 0)
            
        }
    }

    classAddedToList = false

    openDialog(){
        const dialogRef = this.dialog.open(TaskDialogComponent, 
            {
                width:'60%',
                maxWidth:'800px',
                id:'task-dialog',
                data:this.task
            }
        )
    }

    toggleInput(e?){
        if(e){
            e.preventDefault();
        }
        if(!this.task.isComplete){
            if(this.task.isInput){
                this.isTaskTitleInputFocused = false;
            }
            this.task.isInput = !this.task.isInput;
            this.taskChange.emit(this.task);
            
        }
        
    }

    changeTaskBody(e){
        
        this.task.body = e.target.value;
        
        
    }

    onDrop(e){
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
        e.preventDefault();
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


@Component({
    selector:'task-dialog',
    templateUrl:'task_dialog.component.html'
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

@Component({
    template:`
    <img *ngIf='isImage' src={{imgSrc}} />
    `,
    selector:'preview-attachment-dialog'
})

export class PreviewAttachmentDialogComponent{
    constructor(
        private store:Store<AppState>,
        private sanitization:DomSanitizer,
        public dialogRef: MatDialogRef<PreviewAttachmentDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    isImage = false;
    imgSrc;
    isText  = false;

    ngOnInit(){
        console.log(this.data)
        if(this.data.changingThisBreaksApplicationSecurity.includes('image')){
            this.isImage = true;
            this.imgSrc = this.sanitization.bypassSecurityTrustUrl(this.data);
        }
    }
}

@Component({
    templateUrl:'./transfer_task_dialog.component.html',
    selector:'transfer-task-dialog',
    styleUrls:['./transfer_task_dialog.component.css']
})

export class TransferTaskDialogComponent{
    
    rows$: Observable<any>
    boards$: Observable<any>

    selectedRow=null;
    selectedBoard=null;

    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<DeleteDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){
        this.rows$ = this.store.select(state => state.simpleReducer.rows)
        this.boards$ = this.store.select(state => state.simpleReducer.boards)
    }

    transferTask(){
        if(this.selectedBoard){
            this.store.dispatch({type:"TRANSFER_TASK_EMPTY", payload:{droppedTaskId:this.data.key, droppedTaskBoard:this.data.boardKey, droppedOnTaskBoard:this.selectedBoard.key}})
            this.dialogRef.close()
        }
    }

    onCloseDialog(){
        this.dialogRef.close();
    }
}

@Component({
    templateUrl:'./delete_dialog.component.html',
    selector:'delete-dialog'
})

export class DeleteDialogComponent{
    
    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<DeleteDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    onCloseDialog(){
        this.dialogRef.close();
    }

    
}

@Component({
    templateUrl:'./date_pick_dialog.component.html',
    selector:'date-pick-dialog'
})

export class DatePickDialogComponent{
    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<DatePickDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    months =[
        'January',
        'Febuary',
        'Match',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
    selectedMonthIndex=moment().month();
    
    daysInMonth = [

    ]

    days=new Array(moment().month(this.selectedMonthIndex).daysInMonth())
    firstDayOfMonthIsoIndex = moment().month(this.selectedMonthIndex).date(1).weekday()
    
    currentDayMoment = moment();
    dueDateMoment = this.data.dueDate;
    
    
    tabChange(e){
        this.selectedMonthIndex = e;
        this.days=new Array(moment().month(this.selectedMonthIndex).daysInMonth())
        this.firstDayOfMonthIsoIndex = moment().month(this.selectedMonthIndex).date(1).weekday()

        if(this.selectedMonthIndex === moment().month()){
            this.days[moment().date()-1] ='cyan'
        }
        
        if(this.dueDateMoment && this.dueDateMoment.month === this.selectedMonthIndex){
            this.days[this.dueDateMoment.date] = '#adff2f'
        }
    }

    dateSelection(day){
        let momentToExport = moment();
        momentToExport.set('month', this.selectedMonthIndex);
        momentToExport.set('date', day+1);    
        
        if(this.data.dueDate && (this.data.dueDate.month() === momentToExport.month() && this.data.dueDate.date() === momentToExport.date())){
            this.data.dueDate = null;
        }
        else{
            this.days = new Array(moment().month(this.selectedMonthIndex).daysInMonth())
            this.days[moment().date()-1] ='cyan'
            this.days[day] = '#adff2f'

            this.dueDateMoment = moment();
            this.dueDateMoment.month = this.selectedMonthIndex;
            this.dueDateMoment.date = day;

            this.data.dueDate = momentToExport;
        }
            
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        
    }

    closeDialog(){
        this.dialogRef.close();
        
    }

    removeDueDate(){
        this.data.dueDate = null;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        this.days=new Array(moment().month(this.selectedMonthIndex).daysInMonth())
        this.firstDayOfMonthIsoIndex = moment().month(this.selectedMonthIndex).date(1).weekday()

        if(this.selectedMonthIndex === moment().month()){
            this.days[moment().date()-1] ='cyan'
        }
    }

    ngOnInit(){
        
        this.days[moment().date()-1] ='cyan'
        
        if(this.dueDateMoment && this.dueDateMoment.month() === this.selectedMonthIndex){
            console.log("BROOOOO")
            console.log(this.dueDateMoment.month())
            this.days[this.dueDateMoment.date()-1] = '#adff2f'
        }
    }


}

@Component({
    templateUrl:'./photo_dialog.component.html',
    selector:'photo-dialog'
})
export class PhotoDialogComponent{
    
    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    imageToDisplay = this.data.displayImageUrl;

    getFile(e){
        console.log(e.target.files);

        console.log(e.target.files[0])
        let fileReader = new FileReader();
        
        fileReader.onloadend = (e) => {
            console.log(fileReader.result)
            this.imageToDisplay = fileReader.result;
        }

        fileReader.readAsDataURL(e.target.files[0])
        
    }

    onCloseDialog(){
        this.dialogRef.close();
    }

    clearImage(){
        this.imageToDisplay = '';
    }

    saveImage(){
        this.data.displayImageUrl = this.imageToDisplay;
        this.dialogRef.close();
        this.dialogRef.afterClosed().subscribe(result => {
            this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        })
    }

    
}

@Component({
    templateUrl:'./attachment_dialog.component.html',
    selector:'attachment-dialog'
})

export class AttachmentDialogComponent{
    constructor(
        private sanitization:DomSanitizer,
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    downloadLink = null;
    downloadLinks = [...this.data.downloadLinks];
    downloadNames = [...this.data.downloadNames];
    
    getFile(e){

        let fileReader = new FileReader();

        fileReader.onloadend = (e) => {
            let untrustedLink:any = fileReader.result
            this.downloadLink = this.sanitization.bypassSecurityTrustUrl(untrustedLink);
            this.downloadLinks.push(this.downloadLink)
        }
        console.log(e.target.files[0])
        let file = e.target.files[e.target.files.length-1];
        if(file){
            this.downloadNames.push(file.name)
            fileReader.readAsDataURL(e.target.files[e.target.files.length-1])
        }
        
        
    }

    removeFile(index){
        this.downloadNames.splice(index, 1);
        this.downloadLinks.splice(index, 1);
    }

    saveFiles(){
        this.data.downloadNames = this.downloadNames;
        this.data.downloadLinks = this.downloadLinks;
        if(this.data.downloadLinks.length > 0){
            this.data.attachment = true;
        }
        else{
            this.data.attachment = false;
        }
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        this.dialogRef.close();
    }

    onCloseDialog(){
        this.dialogRef.close();
    }
}