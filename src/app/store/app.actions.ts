import { createAction, props } from "@ngrx/store";

export const getState = createAction('GET_STATE');

export const addRow = createAction('ADD_ROW');

export const duplicateRow = createAction('DUPLICATE_ROW', props<{key:number}>())

// export const transferRow = createAction('TRANSFER_ROW', props<{}>())

export const archiveRow = createAction(
    'ARCHIVE_ROW',
    props<{key:number}>()
)
export const archiveRowSuccess = createAction(
    'ARCHIVE_ROW_SUCCESS',
    props<{rows:any, archivedRows:any}>()
)

export const editRowTitle = createAction(
    'EDIT_ROW_TITLE',
    props<{key:number, title:string}>()
);

export const editRowTitleSuccess = createAction(
    'EDIT_ROW_TITLE_ACCESS',
    props<{rows:any}>()
)

export const editRowDescription = createAction(
    'EDIT_ROW_DESCRIPTION',
    props<{key:number, description:string}>()
)


export const duplicateBoard = createAction('DUPLICATE_BOARD', props<{key:number}>())

export const addBoard = createAction(
    'ADD_BOARD',
    props<{key:number}>()
)

export const transferBoard = createAction(
    'TRANSFER_BOARD',
    props<{payload:{
        draggedBoardKey:number, 
        draggedBoardRowKey:number, 
        droppedOnBoardKey:number, 
        droppedOnRowKey:number
    }}>()
)

export const editBoardTitle = createAction(
    'EDIT_BOARD_TITLE',
    props<{key:number, title:string}>()
)

export const archiveBoard = createAction(
    'ARCHIVE_BOARD',
    props<{key:number}>()
)

export const deleteBoard = createAction(
    'DELETE_BOARD',
    props<{key:number}>()
)

export const toggleHideCompleteTasks = createAction(
    'TOGGLE_HIDE_COMPLETE_TASKS',
    props<{key:number, hideCompleteTasks:boolean}>()
)

export const duplicateTask = createAction('DUPLICATE_TASK', props<{boardKey:number, taskKey:number}>())

export const addTask = createAction(
    'ADD_TASK',
    props<{key:number}>()
)

export const editTask = createAction(
    'EDIT_TASK',
    props<{task:any}>()
)

export const linkTask = createAction(
    'LINK_TASK',
    props<{originalTaskKey:number, originalBoardKey:number, linkedTaskKey:number, linkedBoardKey:number}>()
)

export const deleteTask = createAction(
    'DELETE_TASK',
    props<{task:any}>()
)

export const transferTaskEmpty = createAction(
    'TRANSFER_TASK_EMPTY',
    props<{payload:{droppedTaskId:number, droppedTaskBoard:number, droppedOnTaskBoard:number}}>()
)

export const transferTask = createAction(
    'TRANSFER_TASK',
    props<{payload:any}>()
)

export const reorderBoardTasks = createAction(
    'REORDER_BOARD_TASKS',
    props<{payload:{key:number, tasks:any}}>()
)