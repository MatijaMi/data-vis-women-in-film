import{updateState,goBackState} from '../Handlers/stateHandler.js';
import{mouseoverJob,mousemoveJob,mouseleaveJob,mouseoverPersonal,mousemovePersonal,mouseleavePersonal} from '../Handlers/mouseHandler.js';
import{getThirdLevelData} from '../Util/dataProcessing.js';
import{removeTooltip,createTooltip} from '../Util/tooltips.js';
import{updateLevel,getLevels,getLevel,setLevel,goToNextLevel} from '../Handlers/levelHandler.js';
import{setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator} from '../Handlers/navigationHandler.js';
import{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,addPatterns,addPersonPatterns} from '../Util/bubbleUtil.js';
import{drawFirstLevel} from '../Levels/firstLevel.js';
import{showJobD3}  from '../Levels/singleJobCluster.js';

function drawThirdLevel(profession){
    clearPrevDataviz();
    
    var thirdLevelData = getThirdLevelData(profession);
    var personalData = thirdLevelData[0];
    var data = thirdLevelData[1];

    // set the dimensions and margins of the graph
    var width = window.innerWidth;
    var height = window.innerHeight - 50;
    
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  
      // create a tooltip
    var Tooltip = createTooltip();
    var personalTooltip = createTooltip();
    addPatterns(data,svg);
    addPersonPatterns(personalData,svg);
        
    var personalNode = svg.append("g")
        .selectAll("circle")
        .data(personalData)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 90)
        .attr("cx",0)
        .attr("cy", 0)
        .attr("fill", function(d) {
		      return "url(#"+d.id +")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 0.8)
        .on("mouseover",function (d){ mouseoverPersonal(personalTooltip)}) // What to do when hovered
        .on("mousemove", function (d) {mousemovePersonal(personalTooltip,d,this)})
        .on("mouseleave", function(){mouseleavePersonal(personalTooltip)})
    
    var clusPos= width/2;
    if(data.length!=0){
        clusPos=width/3;
    }
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(clusPos).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of
        .force("collide", d3.forceCollide().strength(.5).radius(90).iterations(1))
      simulation
        .nodes(personalData)
        .on("tick", function (d) {
          personalNode
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        });
  
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function (d) { return d.job})
        .attr("r", function (d) { return determineJobSize(d.count,data,3)})
        .attr("cx",0)
        .attr("cy", 0)
        .attr("fill", function(d) {
		      return "url(#bg" + findProfessionPicture(d.job,d.count)+")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", function (d) {mouseoverJob(Tooltip);}) 
        .on("mousemove", function (d) {mousemoveJob(Tooltip,d, this)})
        //.on("mouseenter", function (d) {createLines(d.job, data)})
        .on("mouseleave", function (d) {mouseleaveJob(Tooltip,data)})
        .on("click", function (d) {goToNextLevel(d.job)});

  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(2*(width / 3)).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.5).radius(function (d) { return determineJobSize(d.count,data,3)}).iterations(1))
      .force('y', d3.forceY().y(height/2).strength(0.012));

  //
      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        });
}

export {drawThirdLevel}