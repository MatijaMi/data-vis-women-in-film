import{updateState,goBackState,initializeStates,getStates} from '../Handlers/stateHandler.js';
import{getTopLevelData} from '../Util/dataProcessing.js';
import{mouseoverJob,mousemoveJob,mouseleaveJob} from '../Handlers/mouseHandler.js';
import{removeTooltip,createTooltip,createTextOverlay,speedUpAnimation} from '../Util/tooltips.js';
import{updateLevel,getLevels,getLevel,setLevel,goToNextLevel} from '../Handlers/levelHandler.js';
import{findProfessionPicture,highlightPioneersOfJob,determineJobSize,clearPrevDataviz,determineCxMobile,determineCyMobile,determineJobSizeMobile} from '../Util/bubbleUtil.js';
import{setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator} from '../Handlers/navigationHandler.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
import{showCountries} from '../Levels/CountryCluster.js';
import{showAll} from '../Levels/allPioneers.js';
import{closeSubgroupPanel,timeouts,openSubgroupPanel} from '../Handlers/connectivityHandler.js';
////////////////////////////////////////////////////
//Adding the simulation to the window so it can be accessed and monitored from other functions
window.simulation;
function drawTopLevel(){
    //Preparation
    clearPrevDataviz();
    //Only data about the hightest level in the professsions hierarchy is needed, for how that looks check dendrogram
    var data = getTopLevelData();
    // Setting the width and height to be appropriately sized
    var width = document.getElementById("my_dataviz").clientWidth;
    if(mobileMode){
        var height =150 + (width/4)* Math.ceil(data.length/4);
        document.getElementById("my_dataviz").style.height=height+"px";
        document.getElementById("my_dataviz").style.overflow="";
    }else{
        document.getElementById("my_dataviz").style.height="100%";
        document.getElementById("my_dataviz").style.overflow="hidden";
        var height = document.getElementById("my_dataviz").clientHeight;  
    }
    // Creating and appending the svg that will be used to represent the data
    var svg = d3.select("#my_dataviz").append("svg").attr("width", width).attr("height", height).attr("id","mainSVG");

    //Drawing the circles based on the size of the display
    if(mobileMode){
        for(var i= 0; i <data.length; i++){
            svg.append("g")
                .append("circle")
                .data(data)
                .attr("class", "node")
                .attr("id", function (d) {return data[i].job})
                .attr("r", function (d) {return determineJobSizeMobile()})
                .attr("cx",function (d){return determineCxMobile(i)})
                .attr("cy",function (d){return determineCyMobile(i)})
                .attr("fill", function(d) {
                      return  "url(#bg" + findProfessionPicture(data[i],data,svg,"top")+")";
                })
                .attr("stroke", "black")
                .style("stroke-width", 3)
                .on("click", function (d) {goToNextLevel()});
        }
    }else{
        var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("id", function (d) {return d.job})
            .attr("r", function (d) {return determineJobSize(d.count)})
            .attr("cx",function (d){return 0})
            .attr("cy",function (d){return 0})
            .attr("fill", function(d) {
                  return  "url(#bg" + findProfessionPicture(d,data,svg,"top")+")";
            })
            .attr("stroke", "black")
            .style("stroke-width", 3)
            .on("click", function (d) {simulation.stop();openSubgroupPanel();goToNextLevel(d.job)});
    }

    //Simulation of the forces, only for desktop mode
    if(!mobileMode){
      window.simulation = d3.forceSimulation()
          .force("center", d3.forceCenter().x(width / 2).y(height / 2)) 
          .force("charge", d3.forceManyBody().strength(-10))
          .force("collide", d3.forceCollide().strength(.5).radius(function (d) { return determineJobSize(d.count,d,0)}).iterations(1))
          .force('y', d3.forceY().y(height/2).strength(0.05));

        window.simulation
            .nodes(data)
            .on("tick", function (d) {
              node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
            })
        .on('end', function () {
            if(getLevel()==0 && getStates().length == statePosition){
                //Text overlay that shows what the categories are
                createTextOverlay(data,"Professions","my_dataviz");
            }
        });
        //Slight speed up to make it quicked and so that users don't have to wait so long
        speedUpAnimation(window.simulation,2);
    }else{
        createTextOverlay(data,"Professions","my_dataviz");
    }
    
    // Set of function that create the effect of changing patterns
    function changePattern(){
        if(getLevel()==0){
            d3.selectAll("circle").attr("fill", function(d) {
		      return "url(#bg" + findProfessionPicture(d,data,svg,"top")+")";
            });
            d3.selectAll("circle").transition().duration(1000).attr("fill-opacity","1.0");
          timeouts.push(setTimeout(function(){resetTimer()},5000));
        }
    }
       
    function resetTimer(){
        if(getLevel()==0){
        d3.selectAll("circle").transition().duration(1000).attr("fill-opacity","0.33");
           timeouts.push(setTimeout(function(){changePattern()},1000));
        }   
    }
    
    //Temp function that purely fixes bug in which the pattern changing doesn't work the first time
    function temp(){
        d3.selectAll("circle").transition().duration(0).attr("fill-opacity","0.33");
        d3.selectAll("circle").transition().duration(0).attr("fill-opacity","1");
        timeouts.push(setTimeout(resetTimer,10));
    }
    // An array of timeouts is used so that once the page is left it can be stopped and it doesn't create any errors
    timeouts.push(setTimeout(temp,10000));
    setLevel(0);
    updateState("Professions");
    // Position of current state in state array fixes bug with textoverlay when switching quickly between modes
    var statePosition = getStates().length;
    setLocator("Professions");
    closeSubgroupPanel();
}

export {drawTopLevel}