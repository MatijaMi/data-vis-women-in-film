import{removeTooltip,createTooltip} from '../Util/tooltips.js';
import{updateState,goBackState} from './stateHandler.js';
import{updateLocator} from './navigationHandler.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{drawFirstLevel} from '../Levels/FirstLevel.js';
import{drawSecondLevel} from '../Levels/SecondLevel.js';
import{drawThirdLevel} from '../Levels/ThirdLevel.js';
import{showJobD3} from '../Levels/singleJobCluster.js';
var level = 0;
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

function goBack(){
    setLevel(getLevel()-1);
    removeTooltip("textOverlay");
        if(getLevel()==0){
            document.getElementById("back").remove();
        }
        goBackState();
}

function addBackButton(){ 
    var width = window.innerWidth;
    var height = window.innerHeight - 50;
  if(document.getElementById("back")==null){
      var backButton = d3.select("body")
        .append("div")
        .style("opacity", 1)
        .attr("class", "back")
        .attr("id", "back")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .style("left", width -90 + "px")
        .style("top", height -40 + "px")
        .html("<button> Back </button>");
      document.getElementById("back").addEventListener("click", goBack)
  }
}

function goToNextLevel(profession){
    removeTooltip("tooltip2");
    removeTooltip("tooltip")
    removeTooltip("textOverlay")
    updateLevel(1);
    updateState(profession);
    updateLocator(profession,getLevel());
    addBackButton();
    switch(getLevel()){
        case 1:
           drawFirstLevel(profession);
            break;
        case 2:
            drawSecondLevel(profession);
            break;
        case 3: 
            drawThirdLevel(profession);
            break;
        case 4: 
            showJobD3(profession);
    }  
}

export {updateLevel,setLevel,getLevel,getLevels,goToNextLevel}
