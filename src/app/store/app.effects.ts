import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, first} from 'rxjs/operators'
import { Store } from '@ngrx/store';
import { selectAppState } from './app.selector';
import { combineLatest } from 'rxjs';
import { archiveRowSuccess, archiveRow, editRowTitle, editRowTitleSuccess, postStateToCosmos, putStateToCosmos, getStateFromCosmos, getStateFromCosmosSuccess, saveChanges } from './app.actions';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class AppEffects {
    constructor(private actions$:Actions, private store:Store<any>, private http:HttpClient){}

    archiveRow$ = createEffect(
        () => this.actions$.pipe(
            ofType(archiveRow),
            map(action => {
                let appState = this.store.select(selectAppState)
                return combineLatest(appState, [action])
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
                let appState = this.store.select(selectAppState)
                return combineLatest(appState, [action])
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

    postState$ = createEffect(
        () => this.actions$.pipe(
            ofType(postStateToCosmos),
            map(() => {
                return this.store.select(selectAppState)
            }),
            map((state) => {
                state.subscribe(val => {
                    this.http.post('http://localhost:7071/api/PostState/', val).subscribe(val => val)
                })
            })
        ),
        {dispatch: false}
    )

    putState$ = createEffect(
        () => this.actions$.pipe(
            ofType(putStateToCosmos.type),
            map(() => {
                return this.store.select(selectAppState).pipe(first())
            }),
            map((state) => {
                state.subscribe(val => {
                    this.http.put('http://localhost:7071/api/PutState/', val).pipe(first()).subscribe(val => {
                        console.log('PUT STATE')
                        console.log(val)
                        this.store.dispatch(saveChanges())
                    })
                })
            })
        ),
        {dispatch: false}
    )

    getState$ = createEffect(
        () => this.actions$.pipe(
            ofType(getStateFromCosmos),
            map(() => {
                this.http.get('http://localhost:7071/api/GetState').subscribe(val => {
                    this.store.dispatch(getStateFromCosmosSuccess({state:val}))
                })
            })
        ),
        {dispatch: false}
    )
    
    
}