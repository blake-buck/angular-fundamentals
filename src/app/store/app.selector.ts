import { createSelector } from "@ngrx/store";

export interface ApplicationState{
    appReducer: any;
}

export const selectAppState = (state: ApplicationState) => state.appReducer;

export const selectAppStateWithProps = createSelector(selectAppState, (state, props) =>{
    return {state, props}
})

export const selectBoards = createSelector(selectAppState, state => state.boards);

export const selectSpecificBoards = createSelector(selectBoards, (boards, props) => boards.filter(board =>  board.rowKey === props))

export const selectBoardFromBoardKey = createSelector(selectBoards, (boards,props) => boards.find(board => board.key===props))

export const selectRows = createSelector(selectAppState, state => state.rows)

export const selectSpecificTask = createSelector(selectBoards, (boards, props) => {
     return boards.find(board =>board.key === props.boardKey).tasks.find(task => task.key === props.taskKey)
})

export const selectBoardAndRowTitleFromTaskKey = createSelector(selectAppState, (state, props) => {
    let board = state.boards.find(board => board.key === props);
    let row = state.rows.find(row => row.key === board.rowKey);
    
    return{
        rowTitle:row.title,
        boardTitle:board.title,
        props
    }
})

export const selectIsDataSaved = createSelector(selectAppState, state => state.isDataSaved)

export const selectIsDataSaving = createSelector(selectAppState, state => state.isDataSaving)

export const selectSelectedTask = createSelector(selectAppState, state => state.selectedTask);

export const selectRowCount = createSelector(selectAppState, state => state.rowCount);
export const selectBoardCount = createSelector(selectAppState, state => state.boardCount);
export const selectTaskCount = createSelector(selectAppState, state => state.taskCount);

export const selectArchivedRows = createSelector(selectAppState, state => { 
    return state.archivedRows.map(row => ({
        ...row,
        boards:state.archivedBoards.filter(board => row.boards.includes(board.key))
    }));
});
export const selectArchivedBoards = createSelector(selectAppState, state => {
    const allRows:any = [...state.rows, ...state.archivedRows];
    return state.archivedBoards.filter(board => !allRows.map(row => row.boards).flat().includes(board.key));
});
export const selectArchivedTasks = createSelector(selectAppState, state => state.archivedTasks);