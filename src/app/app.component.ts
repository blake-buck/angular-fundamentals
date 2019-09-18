import { Component } from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import { simpleReducer } from './store/simple.reducer';

import { HttpClient } from '@angular/common/http';

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
    this.store.select(state => console.log(state))
    this.board$ = this.store.select(state => state.simpleReducer.boards)
    this.row$ = this.store.select(state => state.simpleReducer.rows)
  }

  ngOnInit(){
    this.store.dispatch({type:'GET_STATE', payload:''})
  }

  addRow(){
    this.store.dispatch({type:'ADD_ROW', payload:''})
  }

  addBoard(row){
    this.store.dispatch({type:'ADD_BOARD', payload:row.key})
  }

  getApi(){
    console.log('GET')   
    this.http.get('https://localhost:5001/api/board').subscribe(val => console.log(val))
  }


}
