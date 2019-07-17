import {Action} from '@ngrx/store';

const initialState = {
    currentTaskKey:3,
    currentBoardKey:3,
    currentRowKey:3,
    archivedRows:[],
    rows:[
        {key: 1, title:'Test Row', description:'One small step for row, one big step for rowkind', boards:[1,]},
        {key: 2, title:'Financial Row', description:'All my financial Info', boards:[2]}
    ],
    archivedBoards:[],
    boards:[
        {
            rowKey:1,
            key:1, 
            title:'Test Board', 
            hideCompleteTasks:false,
            isArchived:false,
            tasks:[
                {
                key:1, boardKey:1, body:'abc123', isEditing:false, isComplete:false, description:'easy as 1-2-3 a-b-c', important:false, warning:false, payment:true, vacation:true, attachment:false, comments:[], 
                currentChecklistKey:2,
                checklists:[{
                    title:{content:'Checklist', isEditing:false},
                    color:'black',
                    key:1,
                    currentKey:4,
                    completedTasks:1,
                    content:[
                        {key:1, content:'Buy drugs', checked:false, isEditing:false},
                        {key:2, content:'Do drugs', checked:true, isEditing:false},
                        {key:3, content:'Sell drugs', checked:false, isEditing:false}
                    ]
                }],
                cardColor:'',
                fontColor:'',
                dueDate:null,
                displayImageUrl:'',
                downloadNames:[],
                downloadLinks:[]
                }
            ]
        },
        {
            rowKey:2,
            key:2, 
            title:'12321', 
            hideCompleteTasks:false,
            isArchived:false,
            tasks:[
                {key:2, boardKey:2, body:'cash money', isEditing:false, isComplete:true, description:'lets make some cash money', important:true, warning:false, payment:false, vacation:false, attachment:false, comments:[{content:'I GOT ALL THIS CASH', date:'7-4-2019 8:00am'}, {content:'I GOT ALL THIS CASH', date:'7-4-2019 8:00am'}, {content:'I GOT ALL THIS CASH', date:'7-4-2019 8:00am'}], 
                currentChecklistKey:1,
                checklists:[],
                cardColor:'green',
                fontColor:'',
                dueDate:null,
                displayImageUrl:'',
                downloadNames:[],
                downloadLinks:[]
                }
            ]
        }
    ]
}
export function simpleReducer(state=initialState, action){
    let modifiedRow;
    let modifiedRowIndex;
    let modifiedBoard;
    let modifiedBoardIndex;
    let modifiedTaskIndex;

    let secondModifiedBoardIndex;

    let task;
    switch(action.type){
        case "GET_STATE":
            console.log(state);
            return state;

        case "GET_ROW":
            modifiedRow= state.rows.find(row => row.key === action.payload)
            console.log('HURRRR')
            break;

        case "ADD_ROW":
            state.rows.push({key:state.currentRowKey, title:'New Row', description:'this is a new row', boards:[]})
            state.currentRowKey++;
            return state; 

        case "ARCHIVE_ROW":
            modifiedRowIndex = state.rows.findIndex(row => row.key === action.payload);
            modifiedRow = state.rows.splice(modifiedRowIndex, 1);
            state.archivedRows.push(modifiedRow)
            return state;

        case "EDIT_ROW_TITLE":
            modifiedRow = state.rows.find(row => row.key === action.payload.key);
            console.log(modifiedRow)
            modifiedRow.title = action.payload.title;
            return state;

        case "GET_BOARD":
            
            return state

        case "ADD_BOARD":  
            state.boards.push({
                rowKey:action.payload,
                key:state.currentBoardKey,
                title:'New Board', 
                hideCompleteTasks:false,
                isArchived:false,
                tasks:[]
            })
            state.currentBoardKey++;
            return state;

        case "TRANSFER_BOARD":
            console.log(action.payload)
            let {draggedBoardKey,droppedOnBoardKey,draggedBoardRowKey,droppedOnRowKey} = action.payload;
            
            if(draggedBoardRowKey === droppedOnRowKey){
                modifiedBoardIndex = state.boards.findIndex(board => board.key === draggedBoardKey);
                secondModifiedBoardIndex = state.boards.findIndex(board => board.key == droppedOnBoardKey)
                console.log('DO WHAT YOU GOTTA DO', modifiedBoardIndex, secondModifiedBoardIndex)
                
                modifiedBoard = Object.create(state.boards[modifiedBoardIndex])
                state.boards.splice(modifiedBoardIndex, 1);
                state.boards.splice(secondModifiedBoardIndex,0, modifiedBoard)
            }
            else{
                console.log('SOMETHING AINT RIGHT HERE')
                modifiedBoardIndex = state.boards.findIndex(board => board.key == draggedBoardKey);
                modifiedBoard = state.boards[modifiedBoardIndex];
                modifiedBoard.rowKey = droppedOnRowKey
            }

            
            return state;

        case "TRANSFER_BOARD_EMPTY":

            return state;

        case "EDIT_BOARD_TITLE":
            modifiedBoard = state.boards.find(board => board.key === action.payload.key);
            modifiedBoard.title = action.payload.title;
            return state;

        case "ARCHIVE_BOARD":
            modifiedBoardIndex = state.boards.findIndex(board => board.key === action.payload.key);
            state.archivedBoards.push(state.boards.splice(modifiedBoardIndex, 1))
            return state;

        case "DELETE_BOARD":
            modifiedBoardIndex = state.boards.findIndex(board => board.key === action.payload);
            state.boards.splice(modifiedBoardIndex, 1)
            return state;

        case "TOGGLE_HIDE_COMPLETE_TASKS":
            modifiedBoard = state.boards.find((board) => board.key === action.payload.boardKey)
            console.log(modifiedBoard)
            modifiedBoard.hideCompleteTasks = action.payload.hideCompleteTasks;
            return state

        case "GET_TASK":
            
            return state;
        case "ADD_TASK":
            modifiedBoard = state.boards.find((board) => board.key === action.payload.boardKey);
            modifiedBoard.tasks = [...modifiedBoard.tasks, {key:state.currentTaskKey++, boardKey:action.payload.boardKey, body:'', isEditing:false, isComplete:false, description:'', important:false, warning:false, payment:false, vacation:false, comments:[],
            currentChecklistKey:1,
            checklists:[],
            cardColor:'',
            fontColor:'',
            dueDate:null,
            displayImageUrl:'',
            downloadNames:[],
            downloadLinks:[]
            }]
            return{
                ...state,
                currentTaskKey:state.currentTaskKey+1,
                boards:[
                    ...state.boards
                ]
            }
        case "EDIT_TASK":
            modifiedBoard = state.boards.find((board) => board.key === action.payload.boardKey);
            modifiedTaskIndex = modifiedBoard.tasks.findIndex((task) => task.key === action.payload.key)
            
            modifiedBoard.tasks[modifiedTaskIndex] = action.payload;
            console.log('EDITING TASK')
            return{
                ...state,
                boards:[
                    ...state.boards
                ]
            }

        case "DELETE_TASK":
            modifiedBoard = state.boards.find((board) => board.key === action.payload.boardKey);
            modifiedTaskIndex = modifiedBoard.tasks.findIndex((task) => task.key === action.payload.key);

            modifiedBoard.tasks.splice(modifiedTaskIndex, 1);

            return{
                ...state,
                boards:[
                    ...state.boards
                ]
            }
        
        case "TRANSFER_TASK_EMPTY":
            console.log('TRANSFER_TASK_EMPTY')
            // Yes this scoping practice is horrible, I'll fix it later
            if(true){ 
                let {droppedTaskId, droppedTaskBoard, droppedOnTaskBoard} = action.payload;
                let droppedOnBoard = state.boards.find((board) => board.key === droppedOnTaskBoard);
                let draggedBoard   = state.boards.find((board) => board.key === droppedTaskBoard);

                let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
                let addedItem = Object.create(draggedBoard.tasks[draggedIndex]);
                addedItem.boardKey = droppedOnTaskBoard;
                draggedBoard.tasks.splice(draggedIndex, 1);
                droppedOnBoard.tasks.push(addedItem);
                // droppedTaskId, droppedTaskBoard, droppedOnBoard

                return {
                    ...state,
                    boards:[
                        ...state.boards
                    ]
                };
            }
            
            
            
        
        case "TRANSFER_TASK":
            let {droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard} = action.payload;
            console.log('TRANSFER_TASK')

            if(droppedOnTaskBoard === droppedTaskBoard){
                modifiedBoard = state.boards.find((board) => board.key === droppedOnTaskBoard);

                let draggedIndex = modifiedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
                let droppedIndex = modifiedBoard.tasks.findIndex((task)=> task.key === droppedOnTaskId);   

                let addedItem = Object.create(modifiedBoard.tasks[draggedIndex])
                modifiedBoard.tasks.splice(draggedIndex, 1);
                modifiedBoard.tasks.splice(droppedIndex, 0,  addedItem)
                return {
                    ...state,
                    boards:[
                        ...state.boards
                    ]
                };
            }
            else{
                let droppedOnBoard = state.boards.find((board) => board.key === droppedOnTaskBoard);
                let draggedBoard   = state.boards.find((board) => board.key === droppedTaskBoard);

                let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
                let droppedIndex = droppedOnBoard.tasks.findIndex((task)=> task.key === droppedOnTaskId);   
                
                let addedItem = Object.create(draggedBoard.tasks[draggedIndex])
                addedItem.boardKey = droppedOnTaskBoard;
                draggedBoard.tasks.splice(draggedIndex, 1);
                droppedOnBoard.tasks.splice(droppedIndex+1, 0, addedItem);
                return {
                    ...state,
                    boards:[
                        ...state.boards,
                    ]
                };
            }
            

            
    }
}