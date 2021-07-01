import{initializeState} from '../Handlers/stateHandler.js';
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

var timeouts=[];

function handleLoad(){
    
    document.getElementById("countryButton").addEventListener("click",switchToCountries);
    document.getElementById("allPioneersButton").addEventListener("click",switchToAll);
    document.getElementById("professionsButton").addEventListener("click",switchToProfessions);
    document.getElementById("subGroupOpen").addEventListener("click",openSubgroupPanel);
    document.getElementById("closeGroupPanel").addEventListener("click",closeSubgroupPanel);
    initializeState();
    clearPrevDataviz();
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
                    showCountries("");
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
                        setLevel(Number.parseInt(level));
                    }
                }else{
                    alert("Bad Link");
                }
            }
        }
    }else{
        switchToProfessions();
    }  
}

function switchToAll(){
    removeTooltip("textOverlay");
    document.getElementById("locator").innerHTML="";
    setLevel(-1);
    document.getElementById("countryButton").style.display="inline-block";
    document.getElementById("countryButton").style.height="40px";
    document.getElementById("countryButton").style.width="45px";
    document.getElementById("allPioneersButton").style.display="none";
    document.getElementById("professionsButton").style.display="inline-block";
    document.getElementById("professionsButton").style.height="40px";
    document.getElementById("professionsButton").style.width="45px";
    showAll();
}
function switchToCountries(){
    removeTooltip("textOverlay");
    document.getElementById("locator").innerHTML="";
    setLevel(-1);
    document.getElementById("countryButton").style.display="none";
    document.getElementById("countryButton").style.height="60px";
    document.getElementById("countryButton").style.width="65px";
    document.getElementById("allPioneersButton").style.display="inline-block";
    document.getElementById("professionsButton").style.display="inline-block";
    document.getElementById("professionsButton").style.height="60px";
    document.getElementById("professionsButton").style.width="65px";
    showCountries("");
}
function switchToProfessions(){
    removeTooltip("textOverlay");
    document.getElementById("locator").innerHTML="";
    setLevel(-1);
    document.getElementById("countryButton").style.display="inline-block";
    document.getElementById("allPioneersButton").style.display="inline-block";
    document.getElementById("professionsButton").style.display="none";
    document.getElementById("countryButton").style.height="60px";
    document.getElementById("countryButton").style.width="65px";
    document.getElementById("professionsButton").style.height="60px";
    document.getElementById("professionsButton").style.width="65px";
    drawTopLevel();
}
function openSubgroupPanel() {
    document.getElementById("subGroupPanel").style.width = "200px";
    document.getElementById("subGroupPanel").style.border = "5px solid black";
    document.getElementById("subGroupPanel").style.borderLeft = "none";
   
}

function closeSubgroupPanel() {
    document.getElementById("subGroupPanel").style.width = "0";
    document.getElementById("subGroupPanel").style.border = "none";
} 

function clearAllTimeouts(){
    for(var i =0; i<timeouts.length;i++){
        clearTimeout(timeouts[i]);
    }
    timeouts=[];
}
handleLoad();

export{closeSubgroupPanel,openSubgroupPanel,timeouts,clearAllTimeouts};