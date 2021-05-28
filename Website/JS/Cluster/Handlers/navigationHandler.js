import{drawTopLevel} from '../Levels/topLevel.js';
import{drawFirstLevel} from '../Levels/FirstLevel.js';
import{drawSecondLevel} from '../Levels/SecondLevel.js';
import{drawThirdLevel} from '../Levels/ThirdLevel.js';
import{setLevel} from './levelHandler.js'
import{removeTooltip} from '../Util/tooltips.js'

function setLocator(state){
    document.getElementById("locator").innerHTML="<button class='locButtons' id='topLevel'>"+ state+ "</button>";
    addButtonEvents();
    
}

function updateLocator(state,level){
    var text = state.split(" ");
    var inHtml ="";
        for(var j=0; j<text.length;j++){
            if(j==0){
                inHtml=inHtml +text[j].charAt(0).toUpperCase()+ text[j].slice(1);  
            }else{
                inHtml=inHtml + " " +text[j].charAt(0).toUpperCase()+ text[j].slice(1);  
            }  
        }
    state=inHtml;
    document.getElementById("locator").innerHTML=document.getElementById("locator").innerHTML +"<button class='locButtons' id='" +level+"level'>"+ state+ "</button>";
   addButtonEvents();
        
}

function handleLocatorClick(id){
    var name = document.getElementById(id).innerHTML;
    removeTooltip("textOverlay");
    var text = name.split(" ");
    var inHtml ="";
        for(var j=0; j<text.length;j++){
            if(j==0){
                inHtml=inHtml +text[j].charAt(0).toLowerCase()+ text[j].slice(1,text[j].length);   
            }else{
                inHtml=inHtml + " " +text[j].charAt(0).toLowerCase()+text[j].slice(1,text[j].length);   
            }    
    }
    name=inHtml;
    console.log(name);
    var size;
    switch(id){
        case "topLevel":
            if(document.getElementById("back")!=null){
                document.getElementById("back").remove();}
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