import{drawTopLevel} from '../Levels/topLevel.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
import{setLevel} from './levelHandler.js'
import{removeTooltip} from '../Util/tooltips.js'
import{showCountryD3} from '../Levels/singleCountryCluster.js';
import{showCountries} from '../Levels/CountryCluster.js';
import{showAll} from '../Levels/allPioneers.js';
///////////////////////////////////////////

//Function that control the locator on the top of the data visualization for navigation purposes
function setLocator(state){
    document.getElementById("locator").innerHTML="<button class='locButtons' id='0level'>"+ state+ "</button>";
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
    document.getElementById(level-1+"level").innerHTML+="&#8250; "
    document.getElementById("locator").innerHTML=document.getElementById("locator").innerHTML +"<button class='locButtons' id='" +level+"level'>"+ state+ "</button>";
   addButtonEvents();       
}

// Function that determines which part of the locator was clicked and what needs to be done
function handleLocatorClick(id){
    var isCountryMode = document.getElementById("locator").innerHTML.includes("Countries");
    var isAllMode = document.getElementById("locator").innerHTML.includes("All Pioneers");
    var name = document.getElementById(id).innerHTML;
    console.log(name);
    name=name.replace("&#8250; ","");
    removeTooltip("textOverlay");
    if(isCountryMode==false){
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
    }
    console.log(name);
    var size;
    switch(id){
        case "0level":
            if(document.getElementById("back")!=null){
                document.getElementById("back").remove();}
            if(isCountryMode){
                showCountries("");
            }else{
                if(!isAllMode){
                    drawTopLevel(); 
                }
            }
            size=1;
            break;
        case "1level":
            if(isCountryMode){
                console.log(name);
                showCountryD3(name,"");
            }else{
               drawLowerLevel(name,size-1); 
            }
            size=2;
            break;
        case "2level":
            size =3;
            drawLowerLevel(name,size-1);
            break;
        case "3level":
            size=4;
            drawLowerLevel(name,size-1);
            break;
        case "4level":
            size=5;
            drawLowerLevel(name,size-1);
            break;
    }
    
    setLevel(size-1);
    var paras = document.getElementsByClassName("locButtons");
    var s = paras.length-size;
    var level =size-1;
    document.getElementById(level+"level").innerHTML=document.getElementById(level+"level").innerHTML.replace(": ","");
    for(var i =0; i <s;i++){
        removeLastLocButton();
    }
}

// Remove the last entry of the locator if going back one level
function removeLastLocButton(){
    var paras = document.getElementsByClassName("locButtons");
    if(paras.length>0){
        paras[paras.length-1].parentNode.removeChild(paras[paras.length-1]);
    }
    if(paras.length>=2){
        paras[paras.length-1].innerHTML=paras[paras.length-1].innerHTML.replace(": ","");
    }
}
// Function that add teh proper events to the buttons so that they can be used
function addButtonEvents(){
    var params =document.getElementsByClassName("locButtons");
    for(var i = 0; i<params.length;i++){
        document.getElementById(i+"level").addEventListener("click", function(){handleLocatorClick(this.id)});
    }
}

export {setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator}