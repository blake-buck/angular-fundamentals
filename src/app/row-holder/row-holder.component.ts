import { Component } from "@angular/core";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { HttpClient } from '@angular/common/http';
import { selectRows, selectAppState } from '../store/app.selector';
import { getState, addRow, postStateToCosmos, putStateToCosmos, getStateFromCosmos } from '../store/app.actions';
import { AppState } from '../app.component';
import { tap } from 'rxjs/operators';


@Component({
    selector:'row-holder',
    templateUrl:'./row-holder.component.html',
    styleUrls:['./row-holder.component.scss']
})

export class RowHolderComponent{
    board$:Observable<any>
    row$:Observable<any>

    constructor(private store:Store<AppState>, private http:HttpClient){
        this.row$ = this.store.select(selectRows)
    }

    ngOnInit(){
        this.store.dispatch(getState())
        this.store.dispatch(getStateFromCosmos())
    }

    addRow(){
        this.store.dispatch(addRow())
    }

    getApi(){
        console.log('GET')   
        this.http.get('http://localhost:7071/api/GetAllRows/').subscribe(val => console.log(val))
    }

    postApi(){
        console.log('POST')
        this.http.post('http://localhost:7071/api/PostRow/', {key:4, title:'Database Row', description:'this row is a database row', boards:[]}).subscribe(val => console.log(val))
    }

    putApi(){
        console.log('PUT')
        this.http.put('http://localhost:7071/api/PutRow', {description:'my name is jeff'}).subscribe(val => console.log(val))
    }

    postState(){
        // this.http.post('http://localhost:7071/api/PostState', val).subscribe(val => console.log(val)).unsubscribe()
        
        this.store.dispatch(postStateToCosmos())
        
    }

    putState(){
        this.store.dispatch(putStateToCosmos())
    }

    getState(){
        
    }
}