export function _addRow(state){
    return{
        ...state,
        isDataSaved:false,
        rows:[
            ...state.rows,
            {key:state.currentRowKey, position:state.rows.length, title:'New Row', description:'this is a new row', boards:[], expanded:false}
        ],
        currentRowKey:state.currentRowKey + 1,
        rowCount: state.rowCount + 1
    }
}

export function _shiftRowUp(state, action){
    const {position} = action;
    if(position !== 0){
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

export function _deleteRow(state, action){
    const {deletedRow} = action;
    let updatedRows = state.rows.filter(row => row.key !== deletedRow.key);
    let updatedBoards = state.boards.filter(board => !deletedRow.boards.includes(board.key));
    let deletedTasksCount = state.boards.filter(board => deletedRow.boards.includes(board.key)).map(board => board.tasks).reduce((acc, currentVal) => acc.length + currentVal.length)
    return {
        ...state,
        isDataSaved:false,
        rows: updatedRows,
        boards: updatedBoards,
        rowCount: updatedRows.length,
        boardCount: updatedBoards.length,
        taskCount: state.taskCount - deletedTasksCount
    }
}

export function _archiveRow(state, action){
    const {archivedRow} = action;
    let updatedRows = state.rows.filter(row => row.key !== archivedRow.key);
    let updatedBoards = state.boards.filter(board => !archivedRow.boards.includes(board.key)).map((board, index) => ({...board, position:index}));
    let archivedTasksCount = state.boards.filter(board => archivedRow.boards.includes(board.key)).map(board => board.tasks).reduce((acc, currentVal) => acc.length + currentVal.length);

    return {
        ...state,
        rows:updatedRows,
        boards:updatedBoards,

        archivedRows:[...state.archivedRows, archivedRow],
        archivedBoards:[...state.archivedBoards, ...state.boards.filter(board => archivedRow.boards.includes(board.key))],

        rowCount:updatedRows.length,
        boardCount:updatedBoards.length,
        taskCount: state.taskCount - archivedTasksCount
    }
}

export function _restoreArchivedRow(state, action){
    const row = {
        ...action.row,
        boards:action.row.boards.map(board => board.key),
        position: state.rows.length
    }
    return {
        ...state,
        archivedRows:state.archivedRows.filter(row => action.row.key !== row.key),
        archivedBoards:state.archivedBoards.filter(board => !row.boards.includes(board.key)),
        rows:[
            ...state.rows, 
            row
        ],
        boards:[
            ...state.boards,
            ...action.row.boards
        ],
        rowCount:state.rowCount + 1,
        boardCount: state.boardCount + action.row.boards.length,
        taskCount: state.taskCount + action.row.boards.map(board => board.tasks).reduce((acc, currentVal) => acc.length + currentVal.length)
    }
}
