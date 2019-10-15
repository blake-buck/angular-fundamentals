import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {tap, exhaust, exhaustMap, switchMap, map, mergeMap, switchAll, combineAll, concatMap, first} from 'rxjs/operators'
import { Store, select } from '@ngrx/store';
import { selectAppState } from './app.selector';
import { Observable, combineLatest } from 'rxjs';
import { archiveRowSuccess, archiveRow, getState, editRowTitle, editRowTitleSuccess } from './app.actions';

@Injectable()

export class AppEffects {
    constructor(private actions$:Actions, private store:Store<any>){}

    archiveRow$ = createEffect(
        () => this.actions$.pipe(
            ofType(archiveRow),
            map(action => {
                let jeff = this.store.select(selectAppState)
                return combineLatest(jeff, [action])
            }),

            map(state => {
                let payload = state.subscribe(val => {
                    let state = val[0]
                    let clonedRows = [...state.rows]
                    let clonedArchive = [...state.archivedRows]
                    let index = clonedRows.findIndex(row => row.key === val[1].key)
                   
                    let archivedRow = clonedRows.splice(index, 1)
                    clonedArchive.push(archivedRow)
                    this.store.dispatch(archiveRowSuccess({rows:clonedRows, archivedRows:clonedArchive}))
                }).unsubscribe()
                
            })

        ),
        {dispatch:false}
    )
    
    editRowTitle$ = createEffect(
        () => this.actions$.pipe(
            ofType(editRowTitle),
            map(action => {
                let jeff = this.store.select(selectAppState)
                return combineLatest(jeff, [action])
            }),
            map(payload => {
                payload.subscribe(val => {
                    let state = val[0]
                    let clonedRows = [...state.rows]
                    let index = clonedRows.findIndex(row => row.key === val[1].key)
                    let modifiedRow = {...clonedRows[index], title:val[1].title}
                    clonedRows.splice(index, 1, {...modifiedRow})
                    this.store.dispatch(editRowTitleSuccess({rows:clonedRows}))
                }).unsubscribe()
                
            })
        ),
        {dispatch:false}
    )
}