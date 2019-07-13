import {createAction, Action} from '@ngrx/store';

export const addTask = createAction('[Board] Add Task');

export enum ActionTypes{
    AddTask='[Board] Add Task'
}

export class AddTask implements Action{
    type = ActionTypes.AddTask;
    constructor(public payload: any){}
}