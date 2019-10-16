import {Action} from '@ngrx/store';

import * as moment from 'moment'

import {getState, addRow, archiveRow, editRowTitle, editRowDescription, addBoard, transferBoard, editBoardTitle, archiveBoard, deleteBoard, toggleHideCompleteTasks, addTask, editTask, deleteTask, transferTaskEmpty, transferTask, duplicateRow, duplicateTask, duplicateBoard, linkTask, archiveRowSuccess, editRowTitleSuccess, } from './app.actions';
import {initialState } from './app.state';


export function simpleReducer(state=initialState, action){
    let modifiedRow;
    let modifiedRowIndex;
    let modifiedBoard;
    let modifiedBoardIndex;
    let modifiedTaskIndex;

    let secondModifiedBoardIndex;

    let task;
    let newBoards;

    // console.log(state.boards[0].tasks, action);
    switch(action.type){

        case getState.type:
            return state;

        case addRow.type:
            return{
                ...state,
                rows:[
                    ...state.rows,
                    {key:state.currentRowKey, title:'New Row', description:'this is a new row', boards:[]}
                ],
                currentRowKey:state.currentRowKey + 1
            }

        case duplicateRow.type:
            let rowToDuplicate = state.rows.find(row => row.key === action.key);
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
                    duplicatedTask.linkedTasks = []
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
            return {...state};
        
        case archiveRowSuccess.type:
            return {...state, rows:action.rows}


        case editRowTitle.type:
            // modifiedRow = state.rows.find(row => row.key === action.key);
            
            // modifiedRow.title = action.title;
            return state;
        case editRowTitleSuccess.type:
            console.log("SUCCESS", action)
            return {...state, rows:action.rows}
        
        case editRowDescription.type:
            modifiedRow = state.rows.find(row => row.key === action.key);
            return {
                ...state,
                rows:state.rows.map(row => {
                    if(row.key === action.key){
                        return{
                            ...row,
                            description:action.description
                        }
                    }
                    return row
                })
            };

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
                newTask.linkedTasks = []
                state.currentTaskKey++;
                newTasks.push(newTask)
            })
            duplicatedBoard.tasks = newTasks;

            state.boards.push(duplicatedBoard)

            return state;

        case addBoard.type:  
            return{
                ...state,
                rows:state.rows.map(row => {
                    if(row.key === action.key){
                        return{
                            ...row,
                            boards:[...row.boards, state.currentBoardKey]
                        }
                    }
                    return row
                }),
                boards:[
                    ...state.boards,
                    {
                        rowKey:action.key,
                        key:state.currentBoardKey,
                        title:'New Board', 
                        hideCompleteTasks:false,
                        isArchived:false,
                        tasks:[]
                    }
                ],
                currentBoardKey:state.currentBoardKey + 1
            }

        case transferBoard.type:
            let {draggedBoardKey,droppedOnBoardKey,draggedBoardRowKey,droppedOnRowKey} = action.payload;
            // this should really be split into two seperate actions
            if(draggedBoardRowKey === droppedOnRowKey){
                newBoards = state.boards.slice();
                modifiedBoardIndex = newBoards.findIndex(board => board.key === draggedBoardKey);
                secondModifiedBoardIndex = newBoards.findIndex(board => board.key == droppedOnBoardKey)
                modifiedBoard = {...state.boards[modifiedBoardIndex], ...{}}
                newBoards.splice(modifiedBoardIndex, 1);
                newBoards.splice(secondModifiedBoardIndex,0, modifiedBoard)
            }
            else{
                newBoards = state.boards.slice();
                modifiedBoardIndex = newBoards.findIndex(board => board.key == draggedBoardKey);
                modifiedBoard = newBoards.splice(modifiedBoardIndex, 1)
                modifiedBoard[0].rowKey = droppedOnRowKey
                newBoards.push(modifiedBoard[0])
                
            }
            return{
                ...state,
                boards:newBoards
            }

        case editBoardTitle.type:
            return{
                ...state,
                
                boards:
                    state.boards.map(board => {
                        if(board.key === action.key){
                            return {
                                ...board,
                                title:action.title
                            }
                        }
                        return board
                    })
                
            }

        case archiveBoard.type:
            newBoards = state.boards.slice();
            modifiedBoardIndex = newBoards.findIndex(board => board.key === action.key);
            modifiedBoard= newBoards.splice(modifiedBoardIndex, 1)
            
            return {
                ...state,
                archivedBoards:[...state.archivedBoards, modifiedBoard],
                boards:newBoards
            };

        case deleteBoard.type:
            newBoards = state.boards.slice();
            modifiedBoardIndex = newBoards.findIndex(board => board.key === action.key);
            newBoards.splice(modifiedBoardIndex, 1)
            return {
                ...state,
                boards:newBoards
            }

        case toggleHideCompleteTasks.type:
            return {
                ...state,
                boards:state.boards.map(board => {
                    if(board.key === action.key){
                        return {
                            ...board,
                            hideCompleteTasks:action.hideCompleteTasks
                        }
                    }
                    return board
                })
            }

        case duplicateTask.type:
            modifiedBoard = state.boards.find(board => board.key === action.boardKey);
            let modifiedTask = modifiedBoard.tasks.find(task => task.key == action.taskKey);
            let duplicatedTask = {...modifiedTask}///Object.create(modifiedTask);
            duplicatedTask.linkedTasks = []
            let duplicatedTaskChecklists =[]
            duplicatedTask.checklists.map(checklist => {
                let newChecklistContent = []
                checklist.content.map(checklistItem => {
                    console.log(checklistItem)
                    newChecklistContent.push({...checklistItem, ...{}})
                })
                checklist.content =[...newChecklistContent, ...[]]
               duplicatedTaskChecklists.push({...checklist, ...{}})
            })
            duplicatedTask.checklists = [...duplicatedTaskChecklists]
            // duplicatedTask.checklists.content = [...duplicatedTask.checklists.content]

            console.log('DUPLICATED TASK', duplicatedTask.checklists)
            duplicatedTask.key=state.currentTaskKey;
            state.currentTaskKey++;
            duplicatedTask.body += '*duplicated task*'
            modifiedBoard.tasks.push(duplicatedTask)
            return state;

        case addTask.type:
            return{
                ...state,
                currentTaskKey:state.currentTaskKey + 1,
                boards:state.boards.map(board => {
                    if(board.key === action.key){
                        return {
                            ...board,
                            
                            tasks:[
                                ...board.tasks,
                                {
                                    key:state.currentTaskKey, boardKey:action.key, 
                                    body:'', description:'',
                                    isEditing:true, isComplete:false,  important:false, warning:false, payment:false, vacation:false, social:false,work:false,travel:false,
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
                                    
                                    dateCreated:moment(),
                                    lastEdited:moment()
                                }
                            ]
                        }
                    }
                    return board
                })
            }

        case editTask.type:
            // This is definitely going to get broken down into a million different actions at some point
            console.log('EDITING TASK', action.task)
            return{
                ...state,
                boards:state.boards.map(board => {
                    if(board.key === action.task.boardKey){
                        return{
                            ...board,
                            tasks:board.tasks.map(task => {
                                if(task.key === action.task.key){
                                    return action.task
                                }
                                return task
                            })
                        }
                    }
                    return board
                })
            }

        case deleteTask.type:
            newBoards = state.boards.slice();
            modifiedBoard = newBoards.find((board) => board.key === action.task.boardKey);
            modifiedTaskIndex = modifiedBoard.tasks.findIndex((task) => task.key === action.task.key);
            modifiedBoard.tasks.splice(modifiedTaskIndex, 1);
            return{
                ...state,
                boards:newBoards
            }
        
        case transferTaskEmpty.type:
            console.log('TRANSFER_TASK_EMPTY')
            // Yes this scoping practice is horrible, I'll fix it later
            if(true){ 
                let {droppedTaskId, droppedTaskBoard, droppedOnTaskBoard} = action.payload;
                newBoards = state.boards.slice()
                let droppedOnBoard = newBoards.find((board) => board.key === droppedOnTaskBoard);
                let draggedBoard   = newBoards.find((board) => board.key === droppedTaskBoard);

                let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
                let addedItem = {...draggedBoard.tasks[draggedIndex], ...{}};
                addedItem.boardKey = droppedOnTaskBoard;
                draggedBoard.tasks.splice(draggedIndex, 1);
                droppedOnBoard.tasks.push(addedItem);
                // droppedTaskId, droppedTaskBoard, droppedOnBoard

                return {
                    ...state,
                    boards:newBoards
                };
            }
            
            
            
        
        case transferTask.type:
            let {droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard} = action.payload;
            console.log('TRANSFER_TASK', action.payload)
            newBoards     = state.boards.slice();
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
                    ...state,
                    boards:newBoards
                };
            }
            else{
                let droppedOnBoard = newBoards.find((board) => board.key === droppedOnTaskBoard);
                let draggedBoard   = newBoards.find((board) => board.key === droppedTaskBoard);

                let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
                let droppedIndex = droppedOnBoard.tasks.findIndex((task)=> task.key === droppedOnTaskId);   
                
                let addedItem =  {...draggedBoard.tasks[draggedIndex]}//Object.create(draggedBoard.tasks[draggedIndex])
                addedItem.boardKey = droppedOnTaskBoard;
                draggedBoard.tasks.splice(draggedIndex, 1);
                droppedOnBoard.tasks.splice(droppedIndex+1, 0, addedItem);
                return {
                    ...state,
                    boards:newBoards
                };
            }

        case "REORDER_BOARD_TASKS":
            newBoards = state.boards.slice()
            let changedBoard = newBoards.find(board => board.key === action.payload.key);
            changedBoard.tasks= action.payload.tasks
            return {
                ...state,
                boards:newBoards
            };
        
        case linkTask.type:
            console.log(action)
            newBoards = state.boards.slice()
            newBoards.find(board => board.key === action.linkedBoardKey).tasks.find(task => task.key === action.linkedTaskKey).linkedTasks.push({taskKey:action.originalTaskKey, boardKey:action.originalBoardKey});
            newBoards.find(board => board.key === action.originalBoardKey).tasks.find(task => task.key === action.originalTaskKey).linkedTasks.push({taskKey:action.linkedTaskKey, boardKey:action.linkedBoardKey});
            return {
                ...state,
                boards:newBoards
            };
       
            

            
    }
}