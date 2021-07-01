import{updateState,goBackState,initializeState} from '../Handlers/stateHandler.js';
import{getTopLevelData} from '../Util/dataProcessing.js';
import{mouseoverJob,mousemoveJob,mouseleaveJob} from '../Handlers/mouseHandler.js';
import{removeTooltip,createTooltip,createTextOverlay,speedUpAnimation} from '../Util/tooltips.js';
import{updateLevel,getLevels,getLevel,setLevel,goToNextLevel} from '../Handlers/levelHandler.js';
import{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,addPatterns} from '../Util/bubbleUtil.js';
import{setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator} from '../Handlers/navigationHandler.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
import{showCountries} from '../Levels/CountryCluster.js';
import{showAll} from '../Levels/allPioneers.js';
import{closeSubgroupPanel} from '../Handlers/connectivityHandler.js';

var patternTimeout;
var resetTimeout;

function drawTopLevel(){
//Preparation
    initializeState();
    clearPrevDataviz();
    var width = document.getElementById("my_dataviz").clientWidth;
    var height = document.getElementById("my_dataviz").clientHeight;
    
    var data = getTopLevelData();
    var svg = d3.select("#my_dataviz").append("svg").attr("width", width).attr("height", height)
    
    var Tooltip = createTooltip();

//Drawing the circles
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function (d) { return d.job})
        .attr("r", function (d) { return determineJobSize(d.count)})
        .attr("cx",0)
        .attr("cy", 0)
        .attr("fill", function(d) {
		      return "url(#bg" + findProfessionPicture(d,data,svg,"top")+")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", function (d) {mouseoverJob(Tooltip);}) 
        //.on("mousemove", function (d) {mousemoveJob(Tooltip,d, this)})
        .on("mouseleave", function (d) {mouseleaveJob(Tooltip,data)})
        .on("click", function (d) {goToNextLevel(d.job)});

//Simulation of the forces
    
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) 
      .force("charge", d3.forceManyBody().strength(-10))
      .force("collide", d3.forceCollide().strength(.5).radius(function (d) { return determineJobSize(d.count,d,0)}).iterations(1))
      .force('y', d3.forceY().y(height/2).strength(0.05));

      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        })
    .on('end', function () {
        if(getLevel()==0){
            createTextOverlay(data,"Professions","body");
        }
    });
    speedUpAnimation(simulation,2);
    
    
    function changePattern(){
        if(getLevel()==0){
            d3.selectAll("circle").attr("fill", function(d) {
		      return "url(#bg" + findProfessionPicture(d,data,svg,"top")+")";
            });
            d3.selectAll("circle").transition().duration(1000).attr("fill-opacity","1.0");
           patternTimeout = setTimeout(resetTimer,5000);
        }
    }
       
    function resetTimer(){
        if(getLevel()==0){
        d3.selectAll("circle").transition().duration(1000).attr("fill-opacity","0.33");
           resetTimeout = setTimeout(changePattern,1000);
        }   
    }
    
    //Temp function just to fix a bug that occurs due to unexplained reasons
    function temp(){
        d3.selectAll("circle").transition().duration(0).attr("fill-opacity","0.33");
        d3.selectAll("circle").transition().duration(0).attr("fill-opacity","1");
        setTimeout(resetTimer,10);
    }
    
    setTimeout(temp,10000);
    setLevel(0);
    updateState("Professions");
    setLocator("Professions");
    document.getElementById("subGroupOpen").style.display="none";
    closeSubgroupPanel();
}


export {drawTopLevel, resetTimeout, patternTimeout}