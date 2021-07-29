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
window.mobileMode =false;
function handleLoad(){
    
    document.getElementById("countryButton").addEventListener("click",switchToCountries);
    document.getElementById("allPioneersButton").addEventListener("click",switchToAll);
    document.getElementById("professionsButton").addEventListener("click",switchToProfessions);
    document.getElementById("subGroupOpen").addEventListener("click",openSubgroupPanel);
    document.getElementById("closeGroupPanel").addEventListener("click",closeSubgroupPanel);
    initializeState();
    clearPrevDataviz();
    var newWidth =document.getElementById("my_dataviz").clientWidth;
    if(newWidth<800){
            mobileMode=true;
        }else{
            mobileMode=false;
    }
    
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
    document.getElementById("countryButton").style.height="40px";
    document.getElementById("countryButton").style.width="45px";
    document.getElementById("professionsButton").style.height="40px";
    document.getElementById("professionsButton").style.width="45px";
    document.getElementById("allPioneersButton").style.width="45px";
    document.getElementById("allPioneersButton").style.height="40px";
    document.getElementById("allPioneersButton").style.backgroundColor="#bb7043";
    document.getElementById("countryButton").style.backgroundColor="black";
    document.getElementById("professionsButton").style.backgroundColor="black";
    showAll();
}
function switchToCountries(){
    removeTooltip("textOverlay");
    document.getElementById("locator").innerHTML="";
    setLevel(-1);
    document.getElementById("countryButton").style.height="60px";
    document.getElementById("countryButton").style.backgroundColor="#bb7043";
    document.getElementById("countryButton").style.width="65px";
    document.getElementById("professionsButton").style.height="60px";
    document.getElementById("professionsButton").style.width="65px";
    document.getElementById("professionsButton").style.backgroundColor="black";
    document.getElementById("allPioneersButton").style.height="60px";
    document.getElementById("allPioneersButton").style.width="65px";
    document.getElementById("allPioneersButton").style.backgroundColor="black";
    showCountries("");
}
function switchToProfessions(){
    removeTooltip("textOverlay");
    document.getElementById("locator").innerHTML="";
    setLevel(-1);
    document.getElementById("countryButton").style.height="60px";
    document.getElementById("countryButton").style.width="65px";
    document.getElementById("professionsButton").style.height="60px";
    document.getElementById("professionsButton").style.width="65px";
    document.getElementById("allPioneersButton").style.height="60px";
    document.getElementById("allPioneersButton").style.width="65px";
    document.getElementById("professionsButton").style.backgroundColor="#bb7043";
    document.getElementById("countryButton").style.backgroundColor="black";
    document.getElementById("allPioneersButton").style.backgroundColor="black";
    drawTopLevel();
}
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

function clearAllTimeouts(){
    for(var i =0; i<timeouts.length;i++){
        clearTimeout(timeouts[i]);
    }
    timeouts=[];
}
handleLoad();

export{closeSubgroupPanel,openSubgroupPanel,timeouts,clearAllTimeouts};