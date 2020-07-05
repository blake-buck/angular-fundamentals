export function _addRow(state){
    return{
        ...state,
        isDataSaved:false,
        rows:[
            ...state.rows,
            {key:state.currentRowKey, title:'New Row', description:'this is a new row', boards:[], expanded:false}
        ],
        currentRowKey:state.currentRowKey + 1
    }
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