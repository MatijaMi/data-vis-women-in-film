import{removeTooltip,createTooltip} from '../Util/tooltips.js';
import{updateState,goBackState} from './stateHandler.js';
import{updateLocator,removeLastLocButton} from './navigationHandler.js';
import{clearAllTimeouts,timeouts,closeSubgroupPanel} from './connectivityHandler.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
////////////////////////////////////

//Level variable used for profession to keep track of depth
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

// Function that sorts all the profession so that they can be properly assigned to a level later
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

//Function to go back one level
function goBack(){
    setLevel(getLevel()-1);
    removeTooltip("textOverlay");
        if(getLevel()==0){
            document.getElementById("back").remove();
        }
        removeLastLocButton();
        document.getElementById("subGroupOpen").style.display="none";
        goBackState();
}
// Function that adds a back button when one is needed
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

//Function used to go one deeper in the profession clusters
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

export {updateLevel,setLevel,getLevel,getLevels,goToNextLevel,addBackButton,goBack}
