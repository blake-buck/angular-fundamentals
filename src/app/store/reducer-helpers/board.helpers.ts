export function _addBoard(state, action){
    return{
        ...state,
        isDataSaved:false,
        rows:state.rows.map(row => {
            if(row.key === action.key){
                return{
                    ...row,
                    boards:[...row.boards, state.currentBoardKey]
                }
            }
            return row
        }),
        boards:[
            ...state.boards,
            {
                rowKey:action.key,
                key:state.currentBoardKey,
                title:'New Board', 
                hideCompleteTasks:false,
                isArchived:false,
                tasks:[]
            }
        ],
        currentBoardKey:state.currentBoardKey + 1
    }
}

export function _transferBoard(state, action){
    let {draggedBoardKey,droppedOnBoardKey,draggedBoardRowKey,droppedOnRowKey} = action.payload;

    let newBoards = state.boards.slice();
    let modifiedBoardIndex = newBoards.findIndex(board => board.key === draggedBoardKey);

    if(draggedBoardRowKey === droppedOnRowKey){
        let secondModifiedBoardIndex = newBoards.findIndex(board => board.key == droppedOnBoardKey)
        let modifiedBoard = {...state.boards[modifiedBoardIndex], ...{}}
        newBoards.splice(modifiedBoardIndex, 1);
        newBoards.splice(secondModifiedBoardIndex, 0, modifiedBoard)
    }
    else{
        let modifiedBoard = newBoards.splice(modifiedBoardIndex, 1)
        modifiedBoard[0].rowKey = droppedOnRowKey
        newBoards.push(modifiedBoard[0])
    }

    return{
        ...state,
        isDataSaved:false,
        boards:newBoards
    }
}

export function _editBoardTitle(state, action){
    return{
        ...state,
        isDataSaved:false,
        
        boards:
            state.boards.map(board => {
                if(board.key === action.key){
                    return {
                        ...board,
                        title:action.title
                    }
                }
                return board
            })
    }
}

export function _archiveBoard(state, action){
    let newBoards = state.boards.slice();
    let modifiedBoardIndex = newBoards.findIndex(board => board.key === action.key);
    let modifiedBoard = newBoards.splice(modifiedBoardIndex, 1)
    
    return {
        ...state,
        isDataSaved:false,
        archivedBoards:[...state.archivedBoards, modifiedBoard],
        boards:newBoards
    };
}

export function _deleteBoard(state, action){
    let newBoards = state.boards.slice();
    let modifiedBoardIndex = newBoards.findIndex(board => board.key === action.key);
    newBoards.splice(modifiedBoardIndex, 1)
    return {
        ...state,
        isDataSaved:false,
        boards:newBoards
    }
}

export function _toggleHideCompleteTasks(state, action){
    return {
        ...state,
        isDataSaved:false,
        boards:state.boards.map(board => {
            if(board.key === action.key){
                return {
                    ...board,
                    hideCompleteTasks:action.hideCompleteTasks
                }
            }
            return board
        })
    }
}

export function _reorderBoardTasks(state, action){
    let newBoards = state.boards.slice()
    let changedBoard = newBoards.find(board => board.key === action.payload.key);
    changedBoard.tasks= action.payload.tasks;
    return {
        ...state,
        isDataSaved:false,
        boards:newBoards
    };
}