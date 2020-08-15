import { Moment } from 'moment';
import { isNumber, createVerificationObject, isString, isBoolean, isArray, isNull, isOneOf, isObject, hasShape, isArrayOf } from './verification/verification';
export namespace App{
    export interface AppState{
        partitionKey:string;
        currentTaskKey:number,
        currentBoardKey:number,
        currentRowKey:number,
        archivedRows:Row[],
        rows:Row[],
        archivedBoards:Board[],
        archivedTasks:Task[],
        boards:Board[],
        isDataSaved:boolean;
        isDataSaving:boolean;
        isTaskDialogOpen:boolean;
        selectedTask:Task | null;
        rowCount:number;
        boardCount:number;
        taskCount:number;
    }
    
    export interface Row{
        key:number,
        title:string,
        description:string,
        boards:number[],
        expanded:boolean,
        position:number
    }
    
    export interface Board{
        rowKey:number,
        key:number,
        title:string,
        hideCompleteTasks:boolean,
        isArchived:boolean,
        tasks:Task[]
    }

    export interface Task{
        key:number,
        boardKey:number,
        currentChecklistKey:number,
    
        body:string,
        description:string,
        cardColor:string,
        fontColor:string,
    
        // This could also stand to be one array of booleans
        isEditing:boolean,
        isComplete:boolean,
        important:boolean,
        warning:boolean,
        payment:boolean,
        vacation:boolean,
        social:boolean,
        work:boolean,
        travel:boolean,
    
        comments:TaskComment[],
        checklists:TaskChecklist[],
        displayImageUrls:string[],
    
        attachedFiles:{name:string, link:string}[],
    
        labels:TaskLabel[],
        linkedTasks:any[],
    
        dueDate:Moment | null,
        dateCreated:Moment,
        lastEdited:Moment,

        dialogOpen:boolean
    }
    
    export interface TaskComment{
        content:string,
        date:string
    }
    
    export interface TaskChecklist{
        title:{content:string, isEditing:boolean},
        key:number,
        color:string,
        currentKey:number,
        completedTasks:number,
        content:TaskChecklistItem[]
    }
    
    export interface TaskChecklistItem{
        key:number,
        checklistKey:number,
        content:string,
        checked:boolean,
        isEditing:boolean
    }
    
    export interface TaskLabel{
        background:string,
        fontColor:string,
        text:string
    }
    
    export interface TaskLinkedTask{
        taskKey:number,
        boardKey:number
    }
}




const taskComment = {
    content: isString,
    date: isString
}
const taskLinkedTaskTypes = {
    taskKey: isNumber,
    boardKey: isNumber
}
const taskLabelTypes = {
    background: isString,
    fontColor: isString,
    text: isString
}
const taskChecklistItemTypes = {
    key: isNumber,
    checklistKey: isNumber,
    content: isString,
    checked: isBoolean,
    isEditing: isBoolean
}
const taskChecklistTypes ={
    title: hasShape({
        content:isString, 
        isEditing:isBoolean
    }),
    key: isNumber,
    color: isString,
    currentKey: isNumber,
    completedTasks: isNumber,
    content: isArrayOf(hasShape(taskChecklistItemTypes))
}
const attachedFilesTypes = {
    name:isString,
    link:isString
}
const taskTypes = {
    key: isNumber,
    boardKey: isNumber,
    currentChecklistKey: isNumber,

    body: isString,
    description: isString,
    cardColor: isString,
    fontColor: isString,

    isEditing: isBoolean,
    isComplete: isBoolean,
    dialogOpen: isBoolean,
    important: isBoolean,
    warning: isBoolean,
    payment: isBoolean,
    vacation: isBoolean,
    social: isBoolean,
    work: isBoolean,
    travel: isBoolean,

    comments: isArrayOf(hasShape(taskComment)),
    checklists: isArrayOf(hasShape(taskChecklistTypes)),
    displayImageUrls: isArrayOf(isString),
    attachedFiles: isArrayOf(hasShape(attachedFilesTypes)),
    labels: isArrayOf(hasShape(taskLabelTypes)),
    linkedTasks: isArrayOf(hasShape(taskLinkedTaskTypes)),

    dueDate: isOneOf(isString, isNull),
    dateCreated: isString,
    lastEdited: isString,
}

const boardTypes = {
    rowKey: isNumber,
    key: isNumber,
    title: isString,
    hideCompleteTasks: isBoolean,
    isArchived: isBoolean,
    tasks: isArrayOf(hasShape(taskTypes))
}
const rowTypes = {
    key: isNumber,
    title: isString,
    description: isString,
    boards: isArrayOf(isNumber),
    expanded: isBoolean,
    position: isNumber
}

export const appStateTypes = {
    partitionKey: isString,
    currentTaskKey: isNumber,
    currentBoardKey: isNumber,
    currentRowKey: isNumber,

    archivedRows: isArrayOf(hasShape(rowTypes)),
    rows: isArrayOf(hasShape(rowTypes)),

    archivedBoards: isArrayOf(hasShape(boardTypes)),
    archivedTasks: isArrayOf(hasShape(taskTypes)),
    boards: isArrayOf(hasShape(boardTypes)),
    isDataSaved: isBoolean,
    isDataSaving: isBoolean,
    isTaskDialogOpen: isBoolean,
    selectedTask: isOneOf(isNull, hasShape(taskTypes)),
    rowCount:isNumber,
    boardCount:isNumber,
    taskCount:isNumber
}

export const initialState:App.AppState = {
    partitionKey:'state',
    currentTaskKey:1,
    currentBoardKey:3,
    currentRowKey:3,
    archivedRows:[],
    rows:[
        {key: 1, position:0, title:'Test Row', description:'One small step for row, one big step for rowkind', boards:[1], expanded:false},
        {key: 2, position:1, title:'Financial Row', description:'All my financial Info', boards:[2], expanded:false}
    ],
    archivedBoards:[],
    archivedTasks:[],
    boards:[
        {
            rowKey:1,
            key:1, 
            title:'Test Board', 
            hideCompleteTasks:false,
            isArchived:false,
            tasks:[
                
            ]
        },
        {
            rowKey:2,
            key:2, 
            title:'12321', 
            hideCompleteTasks:false,
            isArchived:false,
            tasks:[
                
            ]
        }
    ],
    isDataSaved:true,
    isDataSaving:false,
    isTaskDialogOpen:false,
    selectedTask:null,
    rowCount:2,
    boardCount:2,
    taskCount:0
}