import{removeLastLocButton} from '../Handlers/navigationHandler.js';
import{getLevel} from '../Handlers/levelHandler.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{drawFirstLevel} from '../Levels/FirstLevel.js';
import{drawSecondLevel} from '../Levels/SecondLevel.js';
import{drawThirdLevel} from '../Levels/ThirdLevel.js';

function initializeState(){
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
    removeLastLocButton();
    switch(getLevel()){
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

export {initializeState,updateState, getStates, goBackState}