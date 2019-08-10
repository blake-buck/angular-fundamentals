import * as moment from 'moment';
import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppState } from 'src/app/app.component';
import { Store } from '@ngrx/store';

@Component({
    templateUrl:'./date_pick_dialog.component.html',
    selector:'date-pick-dialog',
    styleUrls:['./date_pick_dialog.component.css']
})

export class DatePickDialogComponent{
    constructor(
        private store:Store<AppState>,
        public dialogRef: MatDialogRef<DatePickDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}

    months =[
        'January',
        'Febuary',
        'Match',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
    selectedMonthIndex=moment().month();
    
    daysInMonth = [

    ]

    days=new Array(moment().month(this.selectedMonthIndex).daysInMonth())
    firstDayOfMonthIsoIndex = moment().month(this.selectedMonthIndex).date(1).weekday()
    
    currentDayMoment = moment();
    dueDateMoment = this.data.dueDate;
    
    
    tabChange(e){
        this.selectedMonthIndex = e;
        this.days=new Array(moment().month(this.selectedMonthIndex).daysInMonth())
        this.firstDayOfMonthIsoIndex = moment().month(this.selectedMonthIndex).date(1).weekday()

        if(this.selectedMonthIndex === moment().month()){
            this.days[moment().date()-1] ='cyan'
        }
        
        if(this.dueDateMoment && this.dueDateMoment.month === this.selectedMonthIndex){
            this.days[this.dueDateMoment.date] = '#adff2f'
        }
    }

    dateSelection(day){
        let momentToExport = moment();
        momentToExport.set('month', this.selectedMonthIndex);
        momentToExport.set('date', day+1);    
        
        if(this.data.dueDate && (this.data.dueDate.month() === momentToExport.month() && this.data.dueDate.date() === momentToExport.date())){
            this.data.dueDate = null;
        }
        else{
            this.days = new Array(moment().month(this.selectedMonthIndex).daysInMonth())
            this.days[moment().date()-1] ='cyan'
            this.days[day] = '#adff2f'

            this.dueDateMoment = moment();
            this.dueDateMoment.month = this.selectedMonthIndex;
            this.dueDateMoment.date = day;

            this.data.dueDate = momentToExport;
        }
            
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        
    }

    closeDialog(){
        this.dialogRef.close();
        
    }

    removeDueDate(){
        this.data.dueDate = null;
        this.store.dispatch({type:'EDIT_TASK', payload:this.data})
        this.days=new Array(moment().month(this.selectedMonthIndex).daysInMonth())
        this.firstDayOfMonthIsoIndex = moment().month(this.selectedMonthIndex).date(1).weekday()

        if(this.selectedMonthIndex === moment().month()){
            this.days[moment().date()-1] ='cyan'
        }
    }

    ngOnInit(){
        
        this.days[moment().date()-1] ='cyan'
        
        if(this.dueDateMoment && this.dueDateMoment.month() === this.selectedMonthIndex){
            console.log("BROOOOO")
            console.log(this.dueDateMoment.month())
            this.days[this.dueDateMoment.date()-1] = '#adff2f'
        }
    }


}