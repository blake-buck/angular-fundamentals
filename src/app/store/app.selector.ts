import { createSelector } from "@ngrx/store";

export interface ApplicationState{
    simpleReducer: any;
}

export const selectAppState = (state: ApplicationState) => state.simpleReducer;

export const selectBoards = createSelector(selectAppState, state => state.boards);
export const selectRows = createSelector(selectAppState, state => state.rows)