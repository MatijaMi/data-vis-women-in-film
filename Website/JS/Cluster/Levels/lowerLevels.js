import{updateState,goBackState} from '../Handlers/stateHandler.js';
import{mouseoverJob,mousemoveJob,mouseleaveJob,mousemovePersonal,mouseoverPersonal,mouseleavePersonal} from '../Handlers/mouseHandler.js';
import{getFirstLevelData,getProfessionData,getSecondLevelData,getThirdLevelData} from '../Util/dataProcessing.js';
import{removeTooltip,createTooltip,createTextOverlay,speedUpAnimation} from '../Util/tooltips.js';
import{updateLevel,getLevels,getLevel,setLevel,goToNextLevel} from '../Handlers/levelHandler.js';
import{setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator} from '../Handlers/navigationHandler.js';
import{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,addPatterns,determinePersonSize,determineSubgroupY,determineSubGroupSize,findPersonPicture} from '../Util/bubbleUtil.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{closeSubgroupPanel} from '../Handlers/connectivityHandler.js';

function drawLowerLevel(profession,level){
    clearPrevDataviz();
    document.getElementById("subGroupOpen").style.display="block";
    var data = getProfessionData(profession);
    var width =document.getElementById("my_dataviz").clientWidth;
    var height = document.getElementById("my_dataviz").clientHeight;
    var svg = d3.select("#my_dataviz").append("svg").attr("width", width).attr("height", height)
    var Tooltip = createTooltip();

      // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function (d) { return d.id})
        .attr("r", function (d) { return determinePersonSize(data)})
        .attr("cx",0)
        .attr("cy", 0)
        .attr("fill", function(d) {
		      return "url(#bg" + findPersonPicture(d.id,data,svg)+")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 3)
        .on("mouseover", function (d) {mouseoverPersonal(Tooltip);}) 
        .on("mousemove", function (d) {mousemovePersonal(Tooltip,d, this)})
        //.on("mouseenter", function (d) {createLines(d.job, data)})
        .on("mouseleave", function (d) {mouseleavePersonal(Tooltip,data)})


      // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.5).radius(function (d) { return determinePersonSize(data)}).iterations(1))
      .force('y', d3.forceY().y(height/2).strength(0.012));
      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        });
        speedUpAnimation(simulation,2);
    
    var furtherSubgroups;
    switch(level){
        case 1:
            furtherSubgroups=getFirstLevelData(profession);
            break;
        case 2:
            furtherSubgroups= getSecondLevelData(profession);
            break;
        case 3:
            furtherSubgroups=getThirdLevelData(profession);
            break;
        case 4: 
            furtherSubgroups=[];
    }
    if(furtherSubgroups.length>0 && profession!="Other"){
        if(document.getElementById("subGroupPanelSVG")!=null){
            document.getElementById("subGroupPanelSVG").remove();
        }
        var width= 200;
        var height= document.getElementById("subGroupPanel").clientHeight;
         var PanelSVG = d3.select("#subGroupPanel").append("svg").attr("width", width).attr("height", height).attr("id", "subGroupPanelSVG");
        var subgroupNodes = PanelSVG.append("g")
            .selectAll("circle")
            .data(furtherSubgroups)
            .enter()
            .append("circle")
            .attr("class", "subgroupNodes")
            .attr("id", function (d) { return d.job})
            .attr("r", function (d) { return determineSubGroupSize(d.count,furtherSubgroups)})
            .attr("cx", 100)
            .attr("cy", function (d) { return determineSubgroupY(d.job, d.count, furtherSubgroups)})
            .attr("fill", function(d) {
		          return "url(#bg" + findProfessionPicture(d,furtherSubgroups,svg,"sub")+")";
            })
        .attr("stroke", "black")
        .style("stroke-width",3)
        .on("mouseover", function (d) {
            createLines(d.job,data);
            mouseoverJob(Tooltip);}) 
        .on("mousemove", function (d) {mousemoveJob(Tooltip,d, this)})
        .on("click", function (d) {goToNextLevel(d.job)})
        .on("mouseleave", function (d) {
            mouseleaveJob(Tooltip,d,this)
            d3.select("#my_dataviz")
                .selectAll("circle")
                .data(data)
                .style("opacity","1")
                .style("stroke-width", "3");
        });
        createTextOverlay(furtherSubgroups,"Professions","subGroupPanel");
    }else{
        document.getElementById("subGroupOpen").style.display="none";
        closeSubgroupPanel();
        if(document.getElementById("subGroupPanelSVG")!=null){
            document.getElementById("subGroupPanelSVG").remove();
        }
    }
}

export {drawLowerLevel}