import {getState, addRow, editRowDescription, addBoard, transferBoard, editBoardTitle, archiveBoard, deleteBoard, toggleHideCompleteTasks, addTask, editTask, deleteTask, transferTaskEmpty, transferTask, duplicateRow, duplicateTask, duplicateBoard, linkTask, archiveRowSuccess, editRowTitleSuccess, getStateFromCosmosSuccess, saveChanges, editRowExpanded, openTaskDialog, setSelectedTask, closeTaskDialog, } from './app.actions';
import {initialState } from './app.state';
import { _addTask, _editTask, _deleteTask, _transferTaskEmpty, _transferTask, _linkTask } from './reducer-helpers/task.helpers';
import { _addBoard, _transferBoard, _editBoardTitle, _archiveBoard, _deleteBoard, _reorderBoardTasks, _toggleHideCompleteTasks } from './reducer-helpers/board.helpers';
import { _addRow, _editRowDescription, _editRowExpanded } from './reducer-helpers/row.helpers';

export function simpleReducer(state=initialState, action){
    switch(action.type){

        case getState.type:
            return state;

        case addRow.type:
            return _addRow(state);
        
        case archiveRowSuccess.type:
            return {...state,
                isDataSaved:false, rows:action.rows}

        case editRowTitleSuccess.type:
            return {...state,
                isDataSaved:false, rows:action.rows}
        
        case editRowDescription.type:
            return _editRowDescription(state, action);

        case editRowExpanded.type:
            return _editRowExpanded(state, action);

        case addBoard.type:  
            return _addBoard(state, action);

        case transferBoard.type:
            return _transferBoard(state, action);

        case editBoardTitle.type:
            return _editBoardTitle(state, action);

        case archiveBoard.type:
            return _archiveBoard(state, action);

        case deleteBoard.type:
            return _deleteBoard(state, action);
        
        case "REORDER_BOARD_TASKS":
            return _reorderBoardTasks(state, action);

        case toggleHideCompleteTasks.type:
            return _toggleHideCompleteTasks(state, action);
            
        case addTask.type:
            return _addTask(state, action);

        case editTask.type:
            return _editTask(state, action);
            
        case deleteTask.type:
            return _deleteTask(state, action);
        
        case transferTaskEmpty.type:
            return _transferTaskEmpty(state, action);
            
        case transferTask.type:
            return _transferTask(state, action);
        
        case linkTask.type:
            return _linkTask(state, action);

        case getStateFromCosmosSuccess.type:
            return {...action.state[0],
                isDataSaved:true
            }

        case saveChanges.type:
            return {
                ...state,
                isDataSaved:true
            }

        case openTaskDialog.type:
            return {
                ...state,
                isTaskDialogOpen:true
            }
        
        case closeTaskDialog.type:
            return {
                ...state, 
                isTaskDialogOpen:false
            }
            
        case setSelectedTask.type:
            return {
                ...state,
                selectedTask: action.task
            }
        
        default:
            return state;
       
    }
}