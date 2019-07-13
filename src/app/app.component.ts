import { Component } from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import { simpleReducer } from './simple.reducer';

export interface AppState{
  simpleReducer:any
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-fundamentals';
  boardTitle = 'Test Board'

  

  board$:Observable<any>
  row$:Observable<any>


  constructor(private store:Store<AppState>){
    this.board$ = this.store.select(state => state.simpleReducer.boards)
    this.row$ = this.store.select(state => state.simpleReducer.rows)
  }

  addBoard(row){
    this.store.dispatch({type:'ADD_BOARD', payload:row.key})
  }

  changeBoardTitle(e){
    this.boardTitle = e;
  }

  

  ngOnInit(){
    this.store.dispatch({type:'GET_STATE', payload:''})
  }


}
