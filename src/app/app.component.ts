import { Component } from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import { simpleReducer } from './store/simple.reducer';

import { HttpClient } from '@angular/common/http';
import { selectBoards, selectRows } from './store/app.selector';
import { getState, addRow } from './store/app.actions';

export interface AppState{
  simpleReducer:any
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  board$:Observable<any>
  row$:Observable<any>

  constructor(private store:Store<AppState>, private http:HttpClient){
    this.row$ = this.store.select(selectRows)
  }

  ngOnInit(){
    this.store.dispatch(getState())
  }

  addRow(){
    this.store.dispatch(addRow())
  }

  getApi(){
    console.log('GET')   
    this.http.get('https://localhost:5001/api/board').subscribe(val => console.log(val))
  }


}
