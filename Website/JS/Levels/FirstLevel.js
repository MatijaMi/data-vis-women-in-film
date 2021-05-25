import{updateState,goBackState} from '../Handlers/stateHandler.js';
import{mouseoverJob,mousemoveJob,mouseleaveJob} from '../Handlers/mouseHandler.js';
import{getFirstLevelData} from '../Util/dataProcessing.js';
import{removeTooltip,createTooltip,createTextOverlay,speedUpAnimation} from '../Util/tooltips.js';
import{updateLevel,getLevels,getLevel,setLevel,goToNextLevel} from '../Handlers/levelHandler.js';
import{setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator} from '../Handlers/navigationHandler.js';
import{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,addPatterns} from '../Util/bubbleUtil.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{drawSecondLevel} from '../Levels/SecondLevel.js';
import{showJobD3} from '../Levels/singleJobCluster.js';

function drawFirstLevel(profession){
    clearPrevDataviz();
    var data = getFirstLevelData(profession);
    var width = window.innerWidth;
    var height = window.innerHeight - 50;
    var svg = d3.select("#my_dataviz").append("svg").attr("width", width).attr("height", height)
    var Tooltip = createTooltip();

    addPatterns(data,svg);

      // Initialize the circle: all located at the center of the svg area
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
        .on("mousemove", function (d) {mousemoveJob(Tooltip,d, this)})
        .on("mouseenter", function (d) {createLines(d.job, data)})
        .on("mouseleave", function (d) {mouseleaveJob(Tooltip,data)})
        .on("click", function (d) {goToNextLevel(d.job)});


      // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.5).radius(function (d) { return determineJobSize(d.count)}).iterations(1))
      .force('y', d3.forceY().y(height/2).strength(0.012));

  //
      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        }).on('end', function () {
            createTextOverlay(data);
        });;
        speedUpAnimation(simulation,2);
}

export {drawFirstLevel}