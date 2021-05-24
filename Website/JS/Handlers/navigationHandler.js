import{drawTopLevel} from '../Levels/topLevel.js';
import{drawFirstLevel} from '../Levels/FirstLevel.js';
import{drawSecondLevel} from '../Levels/SecondLevel.js';
import{drawThirdLevel} from '../Levels/ThirdLevel.js';
import{setLevel} from '../Handlers/levelHandler.js'

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
            document.getElementById("back").remove();
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

export {setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator}