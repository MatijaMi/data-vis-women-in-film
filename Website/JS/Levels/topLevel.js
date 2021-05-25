import{updateState,goBackState,initializeState} from '../Handlers/stateHandler.js';
import{getTopLevelData} from '../Util/dataProcessing.js';
import{mouseoverJob,mousemoveJob,mouseleaveJob} from '../Handlers/mouseHandler.js';
import{removeTooltip,createTooltip,createTextOverlay,speedUpAnimation} from '../Util/tooltips.js';
import{updateLevel,getLevels,getLevel,setLevel,goToNextLevel} from '../Handlers/levelHandler.js';
import{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,addPatterns} from '../Util/bubbleUtil.js';
import{setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator} from '../Handlers/navigationHandler.js';
import{drawFirstLevel} from '../Levels/FirstLevel.js';

function drawTopLevel(){
    var extra= window.location.href.substr(window.location.href.indexOf("Viewer.html")+11);
    if(extra.length>0){
        console.log(extra);
    }
//Preparation
    initializeState();
    clearPrevDataviz();
    var width = window.innerWidth;
    var height = window.innerHeight - 50;
    
    var data = getTopLevelData();
    var svg = d3.select("#my_dataviz").append("svg").attr("width", width).attr("height", height)
    addPatterns(data,svg);
    
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
		      return "url(#bg" + findProfessionPicture(d.job,d.count)+")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", function (d) {mouseoverJob(Tooltip);}) 
        //.on("mousemove", function (d) {mousemoveJob(Tooltip,d, this)})
        //.on("mouseenter", function (d) {createLines(d.job, data)})
        .on("mouseleave", function (d) {mouseleaveJob(Tooltip,data)})
        .on("click", function (d) {goToNextLevel(d.job)});

//Simulation of the forces
    
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) 
      .force("charge", d3.forceManyBody().strength(-10))
      .force("collide", d3.forceCollide().strength(.5).radius(function (d) { return determineJobSize(d.count)}).iterations(1))
      .force('y', d3.forceY().y(height/2).strength(0.012));

      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        })
    .on('end', function () {
        createTextOverlay(data);
    });
    speedUpAnimation(simulation,2);
    
    function resetTimer(){
        if(getLevel()==0){
            d3.selectAll("circle").attr("fill", function(d) {
		      return "url(#bg" + findProfessionPicture(d.job,d.count)+")";
            });
            d3.selectAll("circle").transition().duration(500).attr("fill-opacity","1.0");
            setTimeout(changePattern,5000);
        }
    }
       
    function changePattern(){
        if(getLevel()==0){
        d3.selectAll("circle").transition().duration(1000).attr("fill-opacity","0.0");
            setTimeout(resetTimer,1000);
        }   
    }
    
    setTimeout(changePattern,10000);
    setLevel(0);
    updateState("Professions");
    setLocator("Professions");
}

drawTopLevel();

export {drawTopLevel}