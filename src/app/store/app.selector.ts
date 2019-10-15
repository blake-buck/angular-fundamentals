import { createSelector } from "@ngrx/store";

export interface ApplicationState{
    simpleReducer: any;
}

export const selectAppState = (state: ApplicationState) => state.simpleReducer;
export const selectAppStateWithProps = createSelector(selectAppState, (state, props) =>{
    return {state, props}
})

export const selectBoards = createSelector(selectAppState, state => state.boards);


export const selectSpecificBoards = createSelector(selectBoards, (boards, props) => boards.filter(board =>  board.rowKey === props))

export const selectBoardFromBoardKey = createSelector(selectBoards, (boards,props) => boards.filter(board => board.key===props)[0])

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