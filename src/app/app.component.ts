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
  


}
