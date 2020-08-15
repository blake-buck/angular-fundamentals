import { createAction, props } from "@ngrx/store";

export const getState = createAction('GET_STATE');
export const setState = createAction(
    'SET_STATE',
    props<{state:any}>()
);

export const addRow = createAction('ADD_ROW');

export const duplicateRow = createAction('DUPLICATE_ROW', props<{key:number}>())

export const archiveRow = createAction(
    'ARCHIVE_ROW',
    props<{archivedRow:any}>()
);

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

export const editRowExpanded = createAction(
    'EDIT_ROW_EXPANDED',
    props<{key:number, expanded:boolean}>()
)

export const deleteRow = createAction(
    'DELETE_ROW',
    props<{deletedRow:any}>()
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

export const archiveTask = createAction(
    'ARCHIVE_TASK',
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

export const postStateToCosmos = createAction(
    'POST_STATE_TO_COSMOS'
)

export const putStateToCosmos = createAction(
    'PUT_STATE_TO_COSMOS'
)

export const getStateFromCosmos = createAction(
    'GET_STATE_FROM_COSMOS'
)

export const getStateFromCosmosSuccess = createAction(
    'GET_STATE_FROM_COSMOS_SUCCESS',
    props<{state:any}>()
)

export const scrollRowForward = createAction(
    'SCROLL_ROW_FORWARD'
)

export const scrollRowBackward = createAction(
    'SCROLL_ROW_BACKWARD'
)

export const saveChanges = createAction(
    'SAVE_CHANGES'
)

export const openTaskDialog = createAction(
    'OPEN_TASK_DIALOG'
);
export const closeTaskDialog = createAction(
    'CLOSE_TASK_DIALOG'
);
export const setSelectedTask = createAction(
    'SET_SELECTED_TASK',
    props<{task:any}>()
);

export const shiftRowUp = createAction(
    'SHIFT_ROW_UP',
    props<{position:number}>()
);

export const shiftRowDown = createAction(
    'SHIFT_ROW_DOWN',
    props<{position:number}>()
)

export const restoreArchivedRow = createAction(
    'RESTORE_ARCHIVED_ROW',
    props<{row:any}>()
)

export const restoreArchivedBoard = createAction(
    'RESTORE_ARCHIVED_BOARD',
    props<{board:any, row:any}>()
)

export const restoreArchivedTask = createAction(
    'RESTORE_ARCHIVED_TASK',
    props<{board:any, task:any}>()
)