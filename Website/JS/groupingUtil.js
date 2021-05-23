import{drawTopLevel} from './topLevel.js';
import{drawFirstLevel} from './FirstLevel.js';
import{drawSecondLevel} from './SecondLevel.js';
import{drawThirdLevel} from './ThirdLevel.js';
import{showAll} from './allPioneers.js';
import{groupByCountry} from './groupByCountries.js';
import{showProfessions} from './jobCluser.js';
import{showCountries} from './CountryCluster.js';


var level = 0;
function initializeState(){
   window.states = [];
}
function updateState(newState){
    states.push(newState);
}

function updateLevel(newLevel){
    level += newLevel;
}
function setLevel(newLevel){
    level= newLevel;
}

function getLevel(){
    return level;
}


function getLevels(){
    var topLevel = new Set();
    topLevel.add("Other");
    var firstLevel = new Set();
    var secondLevel = new Set();
    var thirdLevel = new Set();
    
     for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.includes(">")){
                var rest = entry.substr(entry.indexOf(">")+1);
                entry= entry.substr(0,entry.indexOf(">"));
                topLevel.add(entry);
                if(rest.includes(">")){
                    entry= rest.substr(0,rest.indexOf(">"));
                    rest = rest.substr(rest.indexOf(">")+1);
                    firstLevel.add(entry);
                    if(rest.includes(">")){
                        entry= rest.substr(0,rest.indexOf(">"));
                        rest = rest.substr(rest.indexOf(">")+1);
                        secondLevel.add(entry);
                        if(rest.includes(">")){
                            entry= rest.substr(0,rest.indexOf(">"));
                            rest = rest.substr(rest.indexOf(">")+1);
                            thirdLevel.add(entry);
                        }else{
                            thirdLevel.add(rest);
                        }
                    }else{
                        secondLevel.add(rest);
                    }
                }else{
                    firstLevel.add(rest);
                }
            }
        }
    }
    return [topLevel,firstLevel,secondLevel,thirdLevel];
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
            showCountries();
            break;
        case 'Professions':
            drawTopLevel();
            break;
        default: drawTopLevel();
    }
}

function goBackState(){
    var lastState=states[states.length-2];
    states=states.splice(0,states.length-1);
    removeLastLocButton();
    switch(level){
        case 0:
            drawTopLevel();
            break;
        case 1:
            drawFirstLevel(lastState);
            break;
        case 2:
            drawSecondLevel(lastState);
            break;
        case 3:
            drawThirdLevel(lastState);
            break;
    }
    
}

function setLocator(state){
    document.getElementById("locator").innerHTML="<button class='locButtons' id='topLevel'>"+ state+ "</button>";
    addButtonEvents();
    
}
function updateLocator(state,level){
    document.getElementById("locator").innerHTML=document.getElementById("locator").innerHTML +"<button class='locButtons' id='" +level+"level'>"+ state+ "</button>";
   addButtonEvents();
        
}


function handleLocatorClick(id){
    var name = document.getElementById(id).innerHTML;
    var size;
    switch(id){
        case "topLevel":
            drawTopLevel();
            size=1;
            break;
        case "1level":
            drawFirstLevel(name);
            size=2;
            break;
        case "2level":
            drawSecondLevel(name);
            size =3;
            break;
        case "3level":
            drawThirdLevel(name);
            size=4;
            break;
        case "4level":
            showJobD3(name);
            size=5;
            break;
    }
    setLevel(size-1);
    var paras = document.getElementsByClassName("locButtons");
    var s = paras.length-size;
    
    for(var i =0; i <s;i++){
        removeLastLocButton();
    }
}

function removeLastLocButton(){
    var paras = document.getElementsByClassName("locButtons");
    paras[paras.length-1].parentNode.removeChild(paras[paras.length-1]);  
}

function addButtonEvents(){
    var params =document.getElementsByClassName("locButtons");
    for(var i = 0; i<params.length;i++){
        if(i==0){
            document.getElementById("topLevel").addEventListener("click", function(){
                                                         handleLocatorClick(this.id);
                                                         });
        }else{
        document.getElementById(i+"level").addEventListener("click", function(){
                                                         handleLocatorClick(this.id);
                                                         });}
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

function removeTooltip(name){
    var paras = document.getElementsByClassName(name);

      while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
        }
    }

export {determineColor,determineCx,determineCy,handleResize,findNewIndex,updateState,getStates, getLevel,getLevels,updateLevel,setLevel, removeTooltip,goBackState,initializeState,setLocator,updateLocator}