import * as moment from 'moment';

export function addLabel(data, labelColor){
    data.labels.push({background:labelColor, fontColor:'rgb(0,0,0)', text:''})
    return data;
}

export function addComment(data, commentContent){
    data.comments.push({content:commentContent, date: moment().format('dddd, MMMM Do YYYY, h:mm:ss a')})
    return data;
}

export function deleteComment(data, date){
    data.comments = data.comments.filter(comment => comment.date !== date);
    return data;
}

export function changeCardColor(data, color){
    data.cardColor = color;
    return data;
}

export function changeFontColor(data, color){
    data.fontColor = color;
    return data;
}

export function addChecklist(data){
    data.checklists.push({
        title:{content:'New Checklist', isEditing:false},
        key:data.currentChecklistKey,
        color:'black',
        currentKey:1,
        completedTasks:0,
        content:[]
    })
    data.currentChecklistKey ++;
    return data;
}

export function deleteChecklist(data, checklist){
    let deletedChecklistIndex = data.checklists.findIndex(val => val.key === checklist.key)
    data.checklists.splice(deletedChecklistIndex, 1);
    return data;
}

export function changeChecklistTitle(value, data, checklistKey){
    let modifiedChecklist = data.checklists.find(checklist => checklist.key === checklistKey)
    modifiedChecklist.title.content = value;
    return data
}

export function toggleEditChecklistTitle(checklistKey, data){
    let modifiedChecklist = data.checklists.find(checklist => checklist.key === checklistKey)
    modifiedChecklist.title.isEditing = !modifiedChecklist.title.isEditing;
    return {data, isEditing: modifiedChecklist.title.isEditing}
}

export function toggleChecklistItem(checklistKey, item, data){
    let modifiedChecklist = data.checklists.find(checklist => checklist.key === checklistKey)
    let changedItemIndex  = modifiedChecklist.content.findIndex((val) => val.key === item.key)
    if(modifiedChecklist.content[changedItemIndex].content && !modifiedChecklist.content[changedItemIndex].isEditing){
        modifiedChecklist.content[changedItemIndex].checked = !item.checked
        if(modifiedChecklist.content[changedItemIndex].checked){
            modifiedChecklist.completedTasks++;
        }
        else{
            modifiedChecklist.completedTasks--;
        }

        if(modifiedChecklist.completedTasks === modifiedChecklist.content.length){
            modifiedChecklist.color = 'green'
        }
        else{
            modifiedChecklist.color = 'black'
        }

        return data
    }  
}

export function toggleEditChecklistItem(checklistKey, item, data){
    let modifiedChecklist = data.checklists.find(checklist => checklist.key === checklistKey)
    let changedItemIndex  = modifiedChecklist.content.findIndex((val) => val.key === item.key);
    if(modifiedChecklist.content[changedItemIndex].content){
        modifiedChecklist.content[changedItemIndex].isEditing = !item.isEditing;
    }

    return {isEditing:item.isEditing, data}
}

export function addChecklistItem(checklistKey, data){
    let modifiedChecklist = data.checklists.find(checklist => checklist.key === checklistKey)
    let taskKey = modifiedChecklist.currentKey = modifiedChecklist.currentKey +1;
    modifiedChecklist.content.push({key:taskKey, checklistKey, content:'', checked:false, isEditing:true})
    return data;
}

export function deleteChecklistItem(checklistKey, index, data){
    let modifiedChecklist = data.checklists.find(checklist => checklist.key === checklistKey)
    let deletedTask = modifiedChecklist.content.splice(index, 1);
    if(deletedTask[0].checked){
        modifiedChecklist.completedTasks -= 1;
    }
    return data;
}

export function changeChecklistItemText(checklistKey, index, value, data){
    let modifiedChecklist = data.checklists.find(checklist => checklist.key === checklistKey)
    modifiedChecklist.content[index].content= value;
    return data
}

export function removeFile(index, data){
    data.downloadLinks.splice(index, 1);
    data.downloadNames.splice(index, 1);
    return data
}