import { createAction, props } from '@ngrx/store';

// Row specific actions

export const editRowTitle = createAction(
    'EDIT_ROW_TITLE',
    props<{key:Number, title:String}>()
);

export const editRowDescription = createAction(
    'EDIT_ROW_DESCRIPTION',
    props<{key:Number, description:String}>()
)

export const addBoard = createAction(
    'ADD_BOARD',
    props<{key:Number}>()
)

export const archiveRow = createAction(
    'ARCHIVE_ROW',
    props<{key:Number}>()
)

// Shared actions

export const getState = createAction('GET_STATE');
export const transferBoard = createAction(
    'TRANSFER_BOARD',
    props<{payload:{
        draggedBoardKey:Number, 
        draggedBoardRowKey:Number, 
        droppedOnBoardKey:Number, 
        droppedOnRowKey:Number
    }}>()
)