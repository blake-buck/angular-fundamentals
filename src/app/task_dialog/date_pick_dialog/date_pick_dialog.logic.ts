import * as moment from 'moment';

export const months =[
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
];

export const currentDayMoment = moment();

export function calculateDays(selectedMonthIndex){
    return new Array(moment().month(selectedMonthIndex).daysInMonth())
}

export function calculateFirstDayOfMonth(selectedMonthIndex){
    return moment().month(selectedMonthIndex).date(1).weekday()
}

export function tabChange(e, dueDateMoment){
    let selectedMonthIndex = e;
    let days= calculateDays(selectedMonthIndex)
    let firstDayOfMonthIsoIndex = calculateFirstDayOfMonth(selectedMonthIndex)

    if(selectedMonthIndex === moment().month()){
        days[moment().date()-1] ='cyan'
    }
    if(dueDateMoment && dueDateMoment.month() === selectedMonthIndex){
        days[dueDateMoment.date()-1] = '#adff2f'
    }

    return{
        selectedMonthIndex,
        days,
        firstDayOfMonthIsoIndex
    }
}

export function dateSelection(day, selectedMonthIndex, dueDateMoment, data){
    let momentToExport = moment();
    momentToExport.set('month', selectedMonthIndex);
    momentToExport.set('date', day+1);    
    
    let days = calculateDays(selectedMonthIndex)
    if(selectedMonthIndex === moment().month())
        days[moment().date()-1] ='cyan'
    days[day] = '#adff2f'

    dueDateMoment = moment();
    dueDateMoment.set('month',selectedMonthIndex);
    dueDateMoment.set('date', day + 1) 

    data.dueDate = dueDateMoment;
    return {data, days}
}