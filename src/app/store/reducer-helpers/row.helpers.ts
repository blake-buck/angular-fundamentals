export function _addRow(state){
    return{
        ...state,
        isDataSaved:false,
        rows:[
            ...state.rows,
            {key:state.currentRowKey, position:state.rows.length, title:'New Row', description:'this is a new row', boards:[], expanded:false}
        ],
        currentRowKey:state.currentRowKey + 1
    }
}

export function _shiftRowUp(state, action){
    const {position} = action;
    if(position !== 0){
        console.log('shift row up ', state.rows)
        let precedingRow = state.rows[position -1];
        let shiftedRow = state.rows[position]
        state.rows.splice(position-1, 2, shiftedRow, precedingRow)
        return {
            ...state,
            isDataSaved:false,
            rows:state.rows.map((row, index) => ({...row, position:index}))
        }
    }

    return state;
}

export function _shiftRowDown(state, action){
    const {position} = action;
    if(position !== state.rows.length-1){
        console.log('Shift row down ', state.rows)
        let leadingRow = state.rows[position +1];
        let shiftedRow = state.rows[position];
        state.rows.splice(position, 2,  leadingRow, shiftedRow);
        return {
            ...state,
            isDataSaved:false,
            rows:state.rows.map((row, index) => ({...row, position:index}))
        }
    }

    return state;
}

export function _editRowDescription(state, action){
    return {
        ...state,
        isDataSaved:false,
        rows:state.rows.map(row => {
            if(row.key === action.key){
                return{
                    ...row,
                    description:action.description
                }
            }
            return row
        })
    };
}

export function _editRowExpanded(state, action){
    return {
        ...state,
        isDataSaved:false,
        rows:state.rows.map(row => {
            if(row.key === action.key){
                return{
                    ...row,
                    expanded:action.expanded
                }
            }
            return row
        })
    };
}