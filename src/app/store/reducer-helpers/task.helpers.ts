import * as moment from 'moment'

export function _addTask(state, action){
    return{
        ...state,
        isDataSaved:false,
        currentTaskKey:state.currentTaskKey + 1,
        boards:state.boards.map(board => {
            if(board.key === action.key){
                return {
                    ...board,
                    
                    tasks:[
                        ...board.tasks,
                        {
                            key:state.currentTaskKey, boardKey:action.key, 
                            body:'', description:'',
                            isEditing:true, isComplete:false,  important:false, warning:false, payment:false, vacation:false, social:false,work:false,travel:false,
                            comments:[],
                            currentChecklistKey:1,
                            checklists:[],
                            cardColor:'',
                            fontColor:'',
                            dueDate:null,
                            displayImageUrls:[],
                            attachedFiles:[],
                            labels:[],
                            
                            linkedTasks:[],
                            
                            dateCreated:moment().format(),
                            lastEdited:moment().format(),

                            dialogOpen:false
                        }
                    ]
                }
            }
            return board
        }),
        taskCount:state.taskCount + 1
    }
}

export function _editTask(state, action){
    return{
        ...state,
        isDataSaved:false,
        boards:state.boards.map(board => {
            if(board.key === action.task.boardKey){
                return{
                    ...board,
                    tasks:board.tasks.map(task => {
                        if(task.key === action.task.key){
                            return {
                                ...action.task,
                                lastEdited:moment().format()
                            }
                        }
                        return task
                    })
                }
            }
            return board
        }),
        selectedTask:{
            ...action.task,
            lastEdited:moment().format()
        }
    }
}

export function _deleteTask(state, action){
    let newBoards = state.boards.slice();
    let modifiedBoard = newBoards.find((board) => board.key === action.task.boardKey);
    let modifiedTaskIndex = modifiedBoard.tasks.findIndex((task) => task.key === action.task.key);
    modifiedBoard.tasks.splice(modifiedTaskIndex, 1);
    
    return{
        ...state,
        isDataSaved:false,
        boards:newBoards,
        taskCount:state.taskCount - 1
    }
}

export function _transferTaskEmpty(state, action){
    let {droppedTaskId, droppedTaskBoard, droppedOnTaskBoard} = action.payload;
    let newBoards = state.boards.slice()
    let droppedOnBoard = newBoards.find((board) => board.key === droppedOnTaskBoard);
    let draggedBoard   = newBoards.find((board) => board.key === droppedTaskBoard);

    let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
    let addedItem = {...draggedBoard.tasks[draggedIndex], ...{}};
    addedItem.boardKey = droppedOnTaskBoard;
    draggedBoard.tasks.splice(draggedIndex, 1);
    droppedOnBoard.tasks.push(addedItem);

    return {
        ...state,
        isDataSaved:false,
        boards:newBoards
    };
}

export function _transferTask(state, action){
    let {droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard} = action.payload;
    let newBoards = state.boards.slice();
    if(droppedOnTaskBoard === droppedTaskBoard){
        
        let modifiedBoard = state.boards.find((board) => board.key === droppedOnTaskBoard);

        let draggedIndex = modifiedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
        let droppedIndex = modifiedBoard.tasks.findIndex((task)=> task.key === droppedOnTaskId);   

        let addedItem = {...modifiedBoard.tasks[draggedIndex], ...{}}
        modifiedBoard.tasks.splice(draggedIndex, 1);
        modifiedBoard.tasks.splice(droppedIndex, 0,  addedItem)
        
        return {
            ...state,
            isDataSaved:false,
            boards:newBoards
        };
    }
    else{
        let droppedOnBoard = newBoards.find((board) => board.key === droppedOnTaskBoard);
        let draggedBoard   = newBoards.find((board) => board.key === droppedTaskBoard);

        let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId);
        let droppedIndex = droppedOnBoard.tasks.findIndex((task)=> task.key === droppedOnTaskId);   
        
        let addedItem =  {...draggedBoard.tasks[draggedIndex]};
        addedItem.boardKey = droppedOnTaskBoard;
        draggedBoard.tasks.splice(draggedIndex, 1);
        droppedOnBoard.tasks.splice(droppedIndex+1, 0, addedItem);

        return {
            ...state,
            isDataSaved:false,
            boards:newBoards
        };
    }
}

export function _linkTask(state, action){
    let newBoards = state.boards.slice();
    newBoards.find(board => board.key === action.linkedBoardKey).tasks.find(task => task.key === action.linkedTaskKey).linkedTasks.push({taskKey:action.originalTaskKey, boardKey:action.originalBoardKey});
    newBoards.find(board => board.key === action.originalBoardKey).tasks.find(task => task.key === action.originalTaskKey).linkedTasks.push({taskKey:action.linkedTaskKey, boardKey:action.linkedBoardKey});
    
    return {
        ...state,
        isDataSaved:false,
        boards:newBoards
    };
}

export function _archiveTask(state, action){
    let newBoards = state.boards.slice();
    let modifiedBoard = newBoards.find((board) => board.key === action.task.boardKey);
    modifiedBoard.tasks = modifiedBoard.tasks.filter(task => task.key !== action.task.key);

    return {
        ...state,
        boards:newBoards,
        archivedTasks:[...state.archivedTasks, action.task],
        taskCount: state.taskCount - 1
    }
}

export function _restoreArchivedTask(state, action){
    const {task, board} = action;
    console.log('_restoreArchivedTask')
    return {
        ...state,
        archivedTasks:state.archivedTasks.filter(archived => archived.key !== task.key),
        boards:state.boards.map(sboard => {
            if(sboard.key === board.key){
                return {
                    ...board,
                    tasks:[
                        ...board.tasks, 
                        {
                            ...task,
                            boardKey: board.key
                        }
                    ]
                }
            }
            return sboard
        }),
        taskCount: state.taskCount + 1
    }
}