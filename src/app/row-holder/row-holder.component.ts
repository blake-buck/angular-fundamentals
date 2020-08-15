import { Component } from "@angular/core";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { selectRows, selectIsDataSaved, selectBoardCount, selectTaskCount, selectRowCount } from '../store/app.selector';
import { getState, addRow, setState } from '../store/app.actions';
import { MatDialog } from '@angular/material';
import { ArchivedItemsComponent } from '../archived-items/archived-items.component';
import { DomSanitizer } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { createVerificationObject, validateStrict } from '../store/verification/verification';
import { appStateTypes } from '../store/app.state';

@Component({
    selector:'row-holder',
    templateUrl:'./row-holder.component.html',
    styleUrls:['./row-holder.component.scss']
})

export class RowHolderComponent{
    board$:Observable<any>
    row$:Observable<any>

    rowCount$:Observable<any>;
    boardCount$:Observable<any>;
    taskCount$:Observable<any>;

    dataSaved$:Observable<boolean>

    constructor(private store:Store<any>, private dialog:MatDialog, private sanitization:DomSanitizer){
        this.row$ = this.store.select(selectRows)
        this.dataSaved$ = this.store.select(selectIsDataSaved);
        this.rowCount$ = this.store.select(selectRowCount);
        this.boardCount$ = this.store.select(selectBoardCount);
        this.taskCount$ = this.store.select(selectTaskCount);
    }

    ngOnInit(){
        this.store.dispatch(getState())
    }

    addRow(){
        this.store.dispatch(addRow())
    }

    openArchivedItemsDialog(){
        this.dialog.open(ArchivedItemsComponent);
    }


    beginDataExport = false;
    exportData = null;
    
    exportAppState(){
        this.store
            .select(state => state)
            .pipe(first())
            .subscribe(state => {
                let file = new File([JSON.stringify(state)], 'app_state');
        
                let fileReader = new FileReader();

                fileReader.onloadend = (e) => {
                    let untrustedLink:any = fileReader.result;
                    this.exportData = this.sanitization.bypassSecurityTrustUrl(untrustedLink);
                    this.beginDataExport = true;
                }
                if(file){
                    fileReader.readAsDataURL(file);
                }
            })
    }

    downloadLinkLoads(){
        // this seems very hacky, should probably find another way to prevent ExpressionChangedAfter error message
        setTimeout(() => {
            this.beginDataExport = false
        }, 0)
    }

    beginAppStateImport(){
        const el:any = document.querySelector('#importAppState');
        el.click();
    }
    importAppState(e){
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onloadend = (e) => {
            let result:any = fileReader.result;
            result = JSON.parse(result);
            validateStrict(createVerificationObject(appStateTypes, result.appReducer));
            this.store.dispatch(setState({state:result}));
        }
        if(file){
            fileReader.readAsText(file)
        }
    }

}

