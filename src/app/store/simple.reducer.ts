import {Action} from '@ngrx/store';

import * as moment from 'moment'

import {getState, addRow, archiveRow, editRowTitle, editRowDescription, addBoard, transferBoard, editBoardTitle, archiveBoard, deleteBoard, toggleHideCompleteTasks, addTask, editTask, deleteTask, transferTaskEmpty, transferTask, duplicateRow, duplicateTask, duplicateBoard, linkTask } from './app.actions';

const initialState = {
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
    ]
}
export function simpleReducer(state=initialState, action){
    let modifiedRow;
    let modifiedRowIndex;
    let modifiedBoard;
    let modifiedBoardIndex;
    let modifiedTaskIndex;

    let secondModifiedBoardIndex;

    let task;

    console.log(state.boards[0].tasks, action);
    switch(action.type){

        case getState.type:
            return state;

        case addRow.type:
            state.rows.push({key:state.currentRowKey, title:'New Row', description:'this is a new row', boards:[]})
            state.currentRowKey++;
            return state; 
        case duplicateRow.type:
            let rowToDuplicate = state.rows.find(row => action.key);
            let duplicatedRow = {...rowToDuplicate, ...{}}

            duplicatedRow.title += ' *duplicated*';
            duplicatedRow.key = state.currentRowKey;
            state.currentRowKey++;

            let duplicatedBoards = []
            duplicatedRow.boards.map(boardKey => {
                let boardToDuplicate = state.boards.find(board => board.key === boardKey)
                let duplicatedBoard = {...boardToDuplicate, ...{}}
                
                duplicatedBoard.key = state.currentBoardKey;
                state.currentBoardKey++;

                let duplicatedTasks = [];
                duplicatedBoard.tasks.map(task => {
                    let duplicatedTask = {...task, ...{}};
                    duplicatedTask.key = state.currentTaskKey;
                    duplicatedTask.boardKey = duplicatedBoard.key;
                    state.currentTaskKey++;
                    duplicatedTasks.push(duplicatedTask)
                })
                duplicatedBoard.tasks = duplicatedTasks;

                duplicatedBoard.rowKey = duplicatedRow.key;
                duplicatedBoards.push(duplicatedBoard.key);
                state.boards.push(duplicatedBoard)
            })


            
            state.rows.push(duplicatedRow)

            return state
        
        // case "TRANSFER_ROW":
        //     if(true){
        //         let {droppedOnRowKey, droppedRowKey} = action.payload;
        //         let droppedRowIndex = state.rows.findIndex(row => row.key === droppedRowKey);
        //         let droppedRow = state.rows.splice(droppedRowIndex, 1);

        //         let droppedOnRowIndex = state.rows.findIndex(row => row.key === droppedOnRowKey);
        //         state.rows.splice(droppedOnRowIndex, 0, droppedRow[0]);
        //     }
        //     return state;

        case archiveRow.type:
            modifiedRowIndex = state.rows.findIndex(row => row.key === action.key);
            modifiedRow = state.rows.splice(modifiedRowIndex, 1);
            state.archivedRows.push(modifiedRow)
            return state;

        case editRowTitle.type:
            modifiedRow = state.rows.find(row => row.key === action.key);
            
            modifiedRow.title = action.title;
            return state;
        
        case editRowDescription.type:
            modifiedRow = state.rows.find(row => row.key === action.key);
            
            modifiedRow.description = action.description;
            return state;

        case duplicateBoard.type:
            console.log('your mom two')
            let boardToDuplicate = state.boards.find((board) => board.key === action.key);
            let duplicatedBoard  = {...boardToDuplicate, ...{}};
            duplicatedBoard.key = state.currentBoardKey;
            state.currentBoardKey++;

            duplicatedBoard.title += '*duplicated*';

            console.log(duplicatedBoard)
            let newTasks = [];
            duplicatedBoard.tasks.map(task => {
                let newTask ={...task, ...{}}
                newTask.boardKey = duplicatedBoard.key;
                newTask.key = state.currentTaskKey;
                state.currentTaskKey++;
                newTasks.push(newTask)
            })
            duplicatedBoard.tasks = newTasks;

            state.boards.push(duplicatedBoard)

            return state;

        case addBoard.type:  
            modifiedRow = state.rows.find(row => row.key === action.key)
            modifiedRow.boards.push(state.currentBoardKey)
            state.boards.push({
                rowKey:action.key,
                key:state.currentBoardKey,
                title:'New Board', 
                hideCompleteTasks:false,
                isArchived:false,
                tasks:[]
            })
            state.currentBoardKey++;
            return state;

        case transferBoard.type:
            let {draggedBoardKey,droppedOnBoardKey,draggedBoardRowKey,droppedOnRowKey} = action.payload;
            
            if(draggedBoardRowKey === droppedOnRowKey){
                modifiedBoardIndex = state.boards.findIndex(board => board.key === draggedBoardKey);
                secondModifiedBoardIndex = state.boards.findIndex(board => board.key == droppedOnBoardKey)
                
                modifiedBoard = {...state.boards[modifiedBoardIndex], ...{}}
                state.boards.splice(modifiedBoardIndex, 1);
                state.boards.splice(secondModifiedBoardIndex,0, modifiedBoard)
            }
            else{
                modifiedBoardIndex = state.boards.findIndex(board => board.key == draggedBoardKey);
                modifiedBoard = state.boards.splice(modifiedBoardIndex, 1)
                modifiedBoard[0].rowKey = droppedOnRowKey
                state.boards.push(modifiedBoard[0])
            }

            
            return state;


        case editBoardTitle.type:
            modifiedBoard = state.boards.find(board => board.key === action.key);
            modifiedBoard.title = action.title;
            return state;

        case archiveBoard.type:
            modifiedBoardIndex = state.boards.findIndex(board => board.key === action.key);
            state.archivedBoards.push(state.boards.splice(modifiedBoardIndex, 1))
            return state;

        case deleteBoard.type:
            modifiedBoardIndex = state.boards.findIndex(board => board.key === action.key);
            state.boards.splice(modifiedBoardIndex, 1)
            return state;

        case toggleHideCompleteTasks.type:
            modifiedBoard = state.boards.find((board) => board.key === action.key)
            console.log(modifiedBoard)
            modifiedBoard.hideCompleteTasks = action.hideCompleteTasks;
            return state

        case duplicateTask.type:
            modifiedBoard = state.boards.find(board => board.key === action.boardKey);
            let modifiedTask = modifiedBoard.tasks.find(task => task.key == action.taskKey);
            let duplicatedTask = {...modifiedTask}///Object.create(modifiedTask);
            duplicatedTask.key=state.currentTaskKey;
            state.currentTaskKey++;
            duplicatedTask.body += '*duplicated task*'
            modifiedBoard.tasks.push(duplicatedTask)
            return state;

        case addTask.type:
            modifiedBoard = state.boards.find((board) => board.key === action.key);
            modifiedBoard.tasks = [...modifiedBoard.tasks, 
                {
                    key:state.currentTaskKey++, boardKey:action.key, body:'', 
                    isEditing:true, isComplete:false, description:'', important:false, warning:false, payment:false, vacation:false, social:false,work:false,travel:false,
                    comments:[],
                    currentChecklistKey:1,
                    checklists:[],
                    cardColor:'',
                    fontColor:'',
                    dueDate:null,
                    displayImageUrls:[],
                    downloadNames:[],
                    downloadLinks:[],
                    labels:[],
                    
                    linkedTasks:[],
                    linkedTo:[],
                    dateCreated:moment(),
                    lastEdited:moment()
                }
            ]
            return{
                ...state,
                currentTaskKey:state.currentTaskKey+1,
                boards:[
                    ...state.boards
                ]
            }
        case editTask.type:
            console.log('EDITING TASK', action.task)
            modifiedBoard = state.boards.find((board) => board.key === action.task.boardKey);
            modifiedTaskIndex = modifiedBoard.tasks.findIndex((task) => task.key === action.task.key)
            
            modifiedBoard.tasks[modifiedTaskIndex] = action.task;
            modifiedBoard.tasks[modifiedTaskIndex].lastEdited = moment();
            
        
            return{
                ...state,
                boards:[
                    ...state.boards
                ]
            }

        case deleteTask.type:
            modifiedBoard = state.boards.find((board) => board.key === action.task.boardKey);
            modifiedTaskIndex = modifiedBoard.tasks.findIndex((task) => task.key === action.task.key);

            modifiedBoard.tasks.splice(modifiedTaskIndex, 1);

            return{
                ...state,
                boards:[
                    ...state.boards
                ]
            }
        
        case transferTaskEmpty.type:
            console.log('TRANSFER_TASK_EMPTY')
            // Yes this scoping practice is horrible, I'll fix it later
            if(true){ 
                let {droppedTaskId, droppedTaskBoard, droppedOnTaskBoard} = action.payload;
                let droppedOnBoard = state.boards.find((board) => board.key === droppedOnTaskBoard);
                let draggedBoard   = state.boards.find((board) => board.key === droppedTaskBoard);

                let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
                let addedItem = {...draggedBoard.tasks[draggedIndex], ...{}};
                addedItem.boardKey = droppedOnTaskBoard;
                draggedBoard.tasks.splice(draggedIndex, 1);
                droppedOnBoard.tasks.push(addedItem);
                // droppedTaskId, droppedTaskBoard, droppedOnBoard

                return {
                    ...state,
                    boards:[
                        ...state.boards
                    ]
                };
            }
            
            
            
        
        case transferTask.type:
            let {droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard} = action.payload;
            console.log('TRANSFER_TASK', action.payload)

            if(droppedOnTaskBoard === droppedTaskBoard){
                modifiedBoard = state.boards.find((board) => board.key === droppedOnTaskBoard);

                let draggedIndex = modifiedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
                let droppedIndex = modifiedBoard.tasks.findIndex((task)=> task.key === droppedOnTaskId);   

                let addedItem = {...modifiedBoard.tasks[draggedIndex], ...{}}
                console.log("ADDED ITEM", addedItem)
                modifiedBoard.tasks.splice(draggedIndex, 1);
                modifiedBoard.tasks.splice(droppedIndex, 0,  addedItem)
                console.log(state.boards[0].tasks)
                return {
                    ...state
                };
            }
            else{
                let droppedOnBoard = state.boards.find((board) => board.key === droppedOnTaskBoard);
                let draggedBoard   = state.boards.find((board) => board.key === droppedTaskBoard);

                let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
                let droppedIndex = droppedOnBoard.tasks.findIndex((task)=> task.key === droppedOnTaskId);   
                
                let addedItem =  {...draggedBoard.tasks[draggedIndex]}//Object.create(draggedBoard.tasks[draggedIndex])
                addedItem.boardKey = droppedOnTaskBoard;
                draggedBoard.tasks.splice(draggedIndex, 1);
                droppedOnBoard.tasks.splice(droppedIndex+1, 0, addedItem);
                return {
                    ...state,
                };
            }

        case "REORDER_BOARD_TASKS":
            let changedBoard = state.boards.find(board => board.key === action.payload.key);
            changedBoard.tasks= action.payload.tasks
            return state;
        
        case linkTask.type:
            console.log(action)
            state.boards.find(board => board.key === action.linkedBoardKey).tasks.find(task => task.key === action.linkedTaskKey).linkedTasks.push({taskKey:action.originalTaskKey, boardKey:action.originalBoardKey});
            state.boards.find(board => board.key === action.originalBoardKey).tasks.find(task => task.key === action.originalTaskKey).linkedTasks.push({taskKey:action.linkedTaskKey, boardKey:action.linkedBoardKey});
            return state;
       
            

            
    }
}