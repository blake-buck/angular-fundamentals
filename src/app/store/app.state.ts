import { Moment } from 'moment';
export namespace App{
    export interface AppState{
        partitionKey:string;
        currentTaskKey:number,
        currentBoardKey:number,
        currentRowKey:number,
        archivedRows:Row[],
        rows:Row[],
        archivedBoards:Board[],
        boards:Board[],
        isDataSaved:boolean;
        isDataSaving:boolean;
    }
    
    export interface Row{
        key:number,
        title:string,
        description:string,
        boards:number[]
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
    
        // These reeeealyy need to be one array of objects
        downloadNames:string[],
        downloadLinks:string[],
    
    
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


export const initialState:App.AppState = {
    partitionKey:'state',
    currentTaskKey:1,
    currentBoardKey:3,
    currentRowKey:3,
    archivedRows:[],
    rows:[
        {key: 1, title:'Test Row', description:'One small step for row, one big step for rowkind', boards:[1,]},
        {key: 2, title:'Financial Row', description:'All my financial Info', boards:[2]}
    ],
    archivedBoards:[],
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
    isDataSaving:false
}