import{drawTopLevel} from '../Levels/topLevel.js';
import{drawFirstLevel} from '../Levels/FirstLevel.js';
import{drawSecondLevel} from '../Levels/SecondLevel.js';
import{drawThirdLevel} from '../Levels/ThirdLevel.js';
import{showAll} from '../Levels/allPioneers.js';
import{showCountries} from '../Levels/CountryCluster.js';


function handleResize(){
    switch (states[states.length-1]) {
        case 'All':
            showAll();
            break;
        case 'Countries':
            showCountries();
            break;
        case 'Professions':
            drawTopLevel();
            break;
        default: drawTopLevel();
    }
}

export{ handleResize};


