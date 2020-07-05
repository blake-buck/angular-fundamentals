export function autoScroller(e){        
    const scrollBy = 10;
    if(e.forward){          
        this.scrollRow.nativeElement.scrollBy({left:scrollBy, top:0, behavior:'auto' });
    }
    else{
        this.scrollRow.nativeElement.scrollBy({left:-scrollBy, top:0, behavior:'auto' });
    } 
}

export function editTitle(e, row){
    row.title = e.target.value;
}

export function editDescription(e, row){
    row.description = e.target.value;
}

export function onDragStart(e, rowKey){
    e.dataTransfer.setData('text/plain', `ROW${rowKey}`);
}

export function onDragOver(e){
    e.preventDefault();
}

export function onDrop(e, row){
    let eventDataTransfer = e.dataTransfer.getData('text');
    if(eventDataTransfer.includes('BOARD')){
      let unSanitizedKeys = eventDataTransfer.replace('BOARD', '');
      let keyArray = unSanitizedKeys.split('-')
      let droppedOnBoardKey = -1;
      if(+keyArray[1] !== row.key){
          return {draggedBoardKey:+keyArray[0], draggedBoardRowKey:+keyArray[1], droppedOnBoardKey, droppedOnRowKey:row.key}
      }
    }
}