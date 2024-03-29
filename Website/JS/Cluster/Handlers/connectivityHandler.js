import{initializeStates} from '../Handlers/stateHandler.js';
import{setLevel} from '../Handlers/levelHandler.js';
import{updateState} from '../Handlers/stateHandler.js';
import{clearPrevDataviz} from '../Util/bubbleUtil.js';
import{updateLocator,setLocator} from '../Handlers/navigationHandler.js';
import{removeTooltip} from '../Util/tooltips.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
import{showAll} from '../Levels/allPioneers.js';
import{showCountries} from '../Levels/CountryCluster.js';
import{showCountryD3} from '../Levels/singleCountryCluster.js';
import{addBackButton,goBack,getLevel} from '../Handlers/levelHandler.js';
/////////////////////////////////////////////////
//Timeoutes array so that they can be controlled and most importanly stopped
var timeouts=[];
window.mobileMode =false;

//Function that handles the loading of the page and checks what mode needs to be shown and how
function handleLoad(){
    //Add event listeneves to the buttons
    document.getElementById("countryButton").addEventListener("click",switchToCountries);
    document.getElementById("allPioneersButton").addEventListener("click",switchToAll);
    document.getElementById("professionsButton").addEventListener("click",switchToProfessions);
    document.getElementById("subGroupOpen").addEventListener("click",openSubgroupPanel);
    document.getElementById("closeGroupPanel").addEventListener("click",closeSubgroupPanel);
    
    initializeStates();
    clearPrevDataviz();
    
    //Check for mobile mode
    var newWidth =document.getElementById("my_dataviz").clientWidth;
    if(newWidth<800){
            mobileMode=true;
        }else{
            mobileMode=false;
    }
    
    //Check payload in url to determine what needs to be shown
    //Url needs to contain mode and depending on mode either county and timespan or profession, level and the whole profession path for that job
    var payload = window.location.href.substr(window.location.href.indexOf("Cluster.html")+12);
    if(payload.length>0){
        payload=payload.substr(1);
        var parts = payload.split("&");
        var mode = parts[0].substr(parts[0].indexOf("=")+1);
        //All Mode Done
        if(mode =="all"){
            switchToAll();
            showAll();
        }else{
            if(mode=="countries"){
                if(parts.length==1){
                    switchToCountries();
                }else{
                    var country = parts[1].substr(parts[1].indexOf("=")+1);
                    if(country.includes("%20")){
                        country=country.replaceAll("%20"," ");
                    }
                    var timespan="";
                    if(parts.length==3){
                        timespan = parts[2].substr(parts[2].indexOf("=")+1);
                    }   
                        
                    if(country!="all"){
                        showCountryD3(country,timespan);
                        setLocator("Countries")
                        updateLocator(country,1);
                    }else{
                        showCountries(timespan);
                    }
                } 
            }else{
                if(mode=="professions"){
                    if(parts.length==1){
                        switchToProfessions();
                        drawTopLevel();
                    }else{
                        var profession = parts[2].substr(parts[2].indexOf("=")+1);
                        profession=profession.replaceAll("%20"," ");
                        var level = parts[1].substr(parts[1].indexOf("=")+1);
                        var jobs = profession.split("%3E");
                        setLocator("Professions");
                        for(var i =0; i <jobs.length;i++){
                            updateState(jobs[i]);
                        }
                        switch(level){
                            case "1":
                                updateLocator(jobs[0],1);
                                drawLowerLevel(jobs[0],1);
                                break;
                            case "2":
                                updateLocator(jobs[0],1);
                                updateLocator(jobs[1],2);
                                drawLowerLevel(jobs[1],2);
                                break;
                            case "3":
                                updateLocator(jobs[0],1);
                                updateLocator(jobs[1],2);
                                updateLocator(jobs[2],3);
                                drawLowerLevel(jobs[2],3);
                                break;
                            case "4":
                                updateLocator(jobs[0],1);
                                updateLocator(jobs[1],2);
                                updateLocator(jobs[2],3);
                                updateLocator(jobs[3],4);
                                drawLowerLevel(jobs[jobs.length-1],4);
                                break;
                        }
                        addBackButton();
                        document.getElementById("back").addEventListener("click", goBack);
                        setTimeout(function(){
                            setLevel(Number.parseInt(level));
                        },1);
                    }
                }else{
                    alert("Bad Link - Please try again");
                }
            }
        }
    }else{
        switchToProfessions();
    }  
}

// Functions for switching between the individual presentations
function switchToAll(){
    removeTooltip("textOverlay");
    removeTooltip("tooltip");
    document.getElementById("locator").innerHTML="";
    clearAllTimeouts();
    document.getElementById("subGroupOpen").style.display="none";
    setLevel(-1);
    document.getElementById("allPioneersButton").style.backgroundColor="#c76734";
    document.getElementById("countryButton").style.backgroundColor="black";
    document.getElementById("professionsButton").style.backgroundColor="black";
    showAll();
}
function switchToCountries(){
    removeTooltip("textOverlay");
    removeTooltip("tooltip");
    document.getElementById("locator").innerHTML="";
    clearAllTimeouts();
    document.getElementById("subGroupOpen").style.display="none";
    setLevel(-1);
    document.getElementById("countryButton").style.backgroundColor="#c76734";
    document.getElementById("professionsButton").style.backgroundColor="black";
    document.getElementById("allPioneersButton").style.backgroundColor="black";
    showCountries("");
}
function switchToProfessions(){
    removeTooltip("textOverlay");
    removeTooltip("tooltip");
    document.getElementById("locator").innerHTML="";
    clearAllTimeouts();
    document.getElementById("subGroupOpen").style.display="none";
    setLevel(-1);
    document.getElementById("professionsButton").style.backgroundColor="#c76734";
    document.getElementById("countryButton").style.backgroundColor="black";
    document.getElementById("allPioneersButton").style.backgroundColor="black";
    drawTopLevel();
}


//Functions to open and close the subgroup panel on the side
function openSubgroupPanel() {
    if(mobileMode){
        document.getElementById("subGroupPanel").style.width = "100%";
    }else{
        document.getElementById("subGroupPanel").style.width = "10%";
    } 
}

function closeSubgroupPanel() {
    document.getElementById("subGroupPanel").style.width = "0";
} 

//Clear all timeouts to stop possible errors
function clearAllTimeouts(){
    for(var i =0; i<timeouts.length;i++){
        clearTimeout(timeouts[i]);
    }
    timeouts=[];
}

handleLoad();

export{closeSubgroupPanel,openSubgroupPanel,timeouts,clearAllTimeouts, switchToCountries};