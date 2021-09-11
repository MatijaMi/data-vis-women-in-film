import{drawTopLevel} from '../Levels/topLevel.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
import{showAll} from '../Levels/allPioneers.js';
import{showCountries} from '../Levels/CountryCluster.js';
import{showCountryD3} from '../Levels/singleCountryCluster.js';
import{removeTooltip} from '../Util/tooltips.js';
import{clearAllTimeouts,timeouts} from './connectivityHandler.js';
import{getStates} from './stateHandler.js';
import{setLevel} from './levelHandler.js';

var previousWidth = document.getElementById("my_dataviz").clientWidth;

function handleResize(){
    var newWidth =document.getElementById("my_dataviz").clientWidth;
    if(newWidth<800){
            mobileMode=true;
        }else{
            mobileMode=false;
    }
    if(Math.abs(newWidth-previousWidth)>50){
        previousWidth=newWidth;
        if(window.simulation!=null){
            window.simulation.stop();
        }
        
        removeTooltip("textOverlay");
        clearAllTimeouts();
        switch (states[states.length-1]) {
            case 'All':
                showAll();
                break;
            case 'Countries':
                showCountries("");
                break;
            case 'Professions':
                drawTopLevel();
                break;
            default: 
                findStateAction();
        }
    }
    if(document.getElementById("mainSVG")!=null){
        var height = document.getElementById("mainSVG").height; 
        document.getElementById("my_dataviz").style.height=height+"px";
    }
}


function findStateAction(){
    var states =getStates();
    var currectState =states[states.length-1];
    console.log(currectState);
    if(isCountry(currectState)){
        showCountryD3(currectState,"");
    }else{
        if(isProfession(currectState)){
            if(currectState=="Other"){
                
                setLevel(1);
               drawLowerLevel("Other",1) 
            }else{
                var level = determineProfessionLevel(currectState);
                
                setLevel(level);
                drawLowerLevel(currectState,level);   
            }
        }else{
          drawTopLevel();  
        }
    }
    
}


function isCountry(inputState){
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_in.length; j++){
            var entry=wfpp.entries[i].worked_in[j];
            if(entry.length>0){
                if(entry==inputState){
                    return true;
                }
            }
        } 
    } 
}

function isProfession(inputState){
    if(inputState=="Other"){
        return true;
    }
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.length>0){
                if(entry.includes(inputState)){
                    return true;
                }
            }
        } 
    }
}

function determineProfessionLevel(inputState){
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.length>0){
                if(entry.includes(inputState)){
                    var txt = entry.split(">");
                    return txt.length-1;
                }
            }
        } 
    }
}

export{handleResize};


