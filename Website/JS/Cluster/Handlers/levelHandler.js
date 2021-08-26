import{removeTooltip,createTooltip} from '../Util/tooltips.js';
import{updateState,goBackState} from './stateHandler.js';
import{updateLocator,removeLastLocButton} from './navigationHandler.js';
import{clearAllTimeouts,timeouts,closeSubgroupPanel} from './connectivityHandler.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
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
        removeLastLocButton();
        goBackState();
}

function addBackButton(){ 
  if(document.getElementById("back")==null){
      var backButton = d3.select("body")
        .append("div")
        .style("opacity", 1)
        .attr("class", "back")
        .attr("id", "back")
        .html("<button> Back </button>");
  }
}

function goToNextLevel(profession){
    profession=event.srcElement.id;
    removeTooltip("tooltip2");
    removeTooltip("tooltip")
    removeTooltip("textOverlay")
    updateLevel(1);
    updateState(profession);
    updateLocator(profession,getLevel());
    addBackButton();
    document.getElementById("back").addEventListener("click", goBack)
    clearAllTimeouts();
    closeSubgroupPanel();
    drawLowerLevel(profession,getLevel());
}

export {updateLevel,setLevel,getLevel,getLevels,goToNextLevel,addBackButton}
