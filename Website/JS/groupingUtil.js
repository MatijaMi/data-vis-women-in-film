var states = ["All"];

import{showAll} from './allPioneers.js';
import{groupByCountry} from './groupByCountries.js';
import{showProfessions} from './jobCluser.js';

function updateState(newState){
    if(newState!=states[states.length-1]){
        states.push(newState);
    }
    if(states.length>=4){
        if(states[states.length-1]==states[states.length-3] && states[states.length-2]==states[states.length-4]){
            states.splice(states.length-1,1)
            states.splice(states.length-1,1)
        }    
    }
}

function getStates(){
    return states;
}

function determineColor(id, newData, entries, mode){
    
    for(var i = 0; i <newData.length;i++){
        if(newData[i].id==id){
            if(mode=="country"){
                var entry = newData[i].worked_in[0];
            }else{
                var entry = newData[i].worked_as[0];
            }
        }
    }
    var index = -1;
    for(var i =0; i <entries.length; i++){
        if(entries[i]==entry){
            index = i;
        }
    }
    var mul =0;
    if(mode=="country"){
        mul = 7;
    }else{
        mul = 3;
    }
    
    if(index>0){
        var b = Number(255 - index*mul).toString(16);
        var r = Number(1+index*mul).toString(16);
        if(r.length == 1){
            r= "0"+r;
        }
        return "#" + r +"00" + b;
    }
    
}

function findNewIndex(ID, newdata){
    for(var i = 0; i <newdata.length;i++){
        if(newdata[i].id==ID){
            return i;
        }
    }
}


function handleResize(){
    switch (states[states.length-1]) {
        case 'All':
            showAll();
            break;
        case 'Countries':
            groupByCountry("resize");
            break;
        case 'Professions':
            showProfessions();
            break;
        default: showAll();
    }
}


function determineCx(index, width){
    var count = Math.floor(width/70);
    var pad = (width- count*70-40)/2;
    return Math.floor(index%(Math.floor(width/70)))*70+40+pad;
}

function determineCy(index, width){
    return Math.floor(index/(Math.floor(width/70)))*70+80;
}


export {determineColor,determineCx,determineCy,handleResize,findNewIndex,updateState,getStates}