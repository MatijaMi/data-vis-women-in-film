import{removeLastLocButton} from './navigationHandler.js';
import{getLevel} from './levelHandler.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
function initializeStates(){
   window.states = [];
}
function updateState(newState){
    states.push(newState);
}

function getStates(){
    return states;
}
function goBackState(){
    var lastState=states[states.length-2];
    states=states.splice(0,states.length-1);
    if(getLevel()==0){
        drawTopLevel();
    }else{
        drawLowerLevel(lastState,getLevel());
    } 
}

function determineLevelFromState(){
    // TODO Find out what this was supposed to do
    
}

export {initializeStates,updateState, getStates, goBackState}