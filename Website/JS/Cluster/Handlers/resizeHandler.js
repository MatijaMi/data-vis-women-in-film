import{drawTopLevel} from '../Levels/topLevel.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
import{showAll} from '../Levels/allPioneers.js';
import{showCountries} from '../Levels/CountryCluster.js';
import{removeTooltip} from '../Util/tooltips.js';


function handleResize(){
    removeTooltip("textOverlay");
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
        default: drawTopLevel();
    }
}

export{ handleResize};


