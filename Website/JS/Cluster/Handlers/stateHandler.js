import{removeLastLocButton} from './navigationHandler.js';
import{getLevel} from './levelHandler.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
//////////////////////////////////////

//States variable used to track what mode is being shown and when
function initializeStates(){
   window.states = [];
}
function updateState(newState){
    states.push(newState);
}

function getStates(){
    return states;
}
// Only used for professions
function goBackState(){
    var lastState=states[states.length-2];
    states=states.splice(0,states.length-1);
    if(getLevel()==0){
        drawTopLevel();
    }else{
        drawLowerLevel(lastState,getLevel());
    } 
}

export {initializeStates,updateState, getStates, goBackState}