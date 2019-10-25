import { Component } from "@angular/core";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { HttpClient } from '@angular/common/http';
import { selectRows, selectAppState, selectIsDataSaved } from '../store/app.selector';
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

    dataSaved$:Observable<boolean>

    autoSaveInterval;

    constructor(private store:Store<AppState>, private http:HttpClient){
        this.row$ = this.store.select(selectRows)
        this.dataSaved$ = this.store.select(selectIsDataSaved);
    }

    ngOnInit(){
        this.store.dispatch(getState())
        // this.store.dispatch(getStateFromCosmos())
        this.autoSaveInterval = setInterval(() => {
            // this.store.dispatch(putStateToCosmos())
        }, 60000)
    }

    ngOnDestroy(){
        clearInterval(this.autoSaveInterval)
    }

    addRow(){
        this.store.dispatch(addRow())
    }


    postState(){
        this.store.dispatch(postStateToCosmos())  
    }

    putState(){
        this.store.dispatch(putStateToCosmos())
    }

    getState(){
        
    }
    
}