import { createSelector } from "@ngrx/store";

export interface ApplicationState{
    simpleReducer: any;
}

export const selectAppState = (state: ApplicationState) => state.simpleReducer;

export const selectBoards = createSelector(selectAppState, state => state.boards);

export const selectSpecificBoards = createSelector(selectBoards, (boards, props) => boards.filter(board =>  board.rowKey === props))

export const selectBoardFromBoardKey = createSelector(selectBoards, (boards,props) => boards.filter(board => board.key===props)[0])

export const selectRows = createSelector(selectAppState, state => state.rows)