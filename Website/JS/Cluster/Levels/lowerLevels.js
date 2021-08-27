import{updateState,goBackState} from '../Handlers/stateHandler.js';
import{mouseoverJob,mousemoveJob,mouseleaveJob,mousemovePersonal,mouseoverPersonal,mouseleavePersonal,mouseClickPersonal,showMobileTooltipPanel} from '../Handlers/mouseHandler.js';
import{getFirstLevelData,getProfessionData,getSecondLevelData,getThirdLevelData} from '../Util/dataProcessing.js';
import{removeTooltip,createTooltip,createTextOverlay,speedUpAnimation} from '../Util/tooltips.js';
import{updateLevel,getLevels,getLevel,setLevel,goToNextLevel} from '../Handlers/levelHandler.js';
import{setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator} from '../Handlers/navigationHandler.js';
import{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,determinePersonSize,determineSubgroupY,determineSubGroupSize,findPersonPicture, determineCxMobile,determineCyMobile,determineJobSizeMobile} from '../Util/bubbleUtil.js';
import{drawTopLevel} from '../Levels/topLevel.js';
import{closeSubgroupPanel,openSubgroupPanel} from '../Handlers/connectivityHandler.js';

function drawLowerLevel(profession,level){
    clearPrevDataviz();
    document.getElementById("subGroupOpen").style.display="block";
    if(!mobileMode){
        openSubgroupPanel();
    }
    var data = getProfessionData(profession);
    var width =document.getElementById("my_dataviz").clientWidth;
    if(mobileMode){
        var heightSVG =150 + (width/4)* Math.ceil(data.length/4);
        document.getElementById("my_dataviz").style.height="100%";
        var heightDIV = document.getElementById("my_dataviz").clientHeight;
        var height =Math.max(heightSVG,heightDIV);
        document.getElementById("my_dataviz").style.height=height+"px";
        document.getElementById("my_dataviz").style.overflow="auto";
    }else{
        document.getElementById("my_dataviz").style.height="100%";
        var height = document.getElementById("my_dataviz").clientHeight;  
    }
    var svg = d3.select("#my_dataviz").append("svg").attr("width", width).attr("height", height)
    var Tooltip = createTooltip();

      // Initialize the circle: all located at the center of the svg area
    if(mobileMode){
        for(var i= 0; i <data.length; i++){
            svg.append("g")
                .append("circle")
                .data(data)
                .attr("class", "node")
                .attr("id", function (d) {return data[i].id})
                .attr("r", function (d) {return determineJobSizeMobile()})
                .attr("cx",function (d){return determineCxMobile(i)})
                .attr("cy",function (d){return determineCyMobile(i)})
                .attr("fill", function(d) {
                      return  "url(#bg" + findPersonPicture(data[i].id,data,svg,"top")+")";
                })
                .attr("stroke", "black")
                .style("stroke-width", 3)
                .on("click", function (d) {showMobileTooltipPanel(d)});
        }
        
    }else{
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
            .on("mouseleave", function (d) {mouseleavePersonal(Tooltip,data)})
            .on("click", function (d) {mouseClickPersonal(Tooltip,data)});
    }

      // Features of the forces applied to the nodes:
    if(!mobileMode){
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
    }
    
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
        
        if(mobileMode){
            var width= document.getElementById("my_dataviz").clientWidth;
            var heightSVG =50 + (width/2)* Math.ceil(furtherSubgroups.length/2);
            document.getElementById("my_dataviz").style.height="100%";
            var heightDIV = document.getElementById("my_dataviz").clientHeight;
            var height =Math.max(heightSVG,heightDIV);
            document.getElementById("my_dataviz").style.height=height+"px";
            document.getElementById("subGroupPanel").style.overflow="auto";
            var PanelSVG = d3.select("#subGroupPanel").append("svg").attr("width", width).attr("height", height).attr("id", "subGroupPanelSVG");
            for(var i= 0; i <furtherSubgroups.length; i++){
                PanelSVG.append("g")
                    .append("circle")
                    .data(furtherSubgroups)
                    .attr("class", "subgroupNodes")
                    .attr("id", function (d) { return furtherSubgroups[i].job})
                    .attr("r", function (d) {return determineJobSizeMobile("subMobile")})
                    .attr("cx",function (d){return determineCxMobile(i,"subMobile")})
                    .attr("cy",function (d){return determineCyMobile(i,"subMobile")})
                    .attr("fill", function(d) {
                          return "url(#bg" + findProfessionPicture(d,furtherSubgroups,svg,"subMobile")+")";
                    })
                .attr("stroke", "white")
                .style("stroke-width",3)
                .on("click", function (d) {goToNextLevel()})
                .on("mouseleave", function (d) {
                    d3.select("#my_dataviz")
                        .selectAll("circle")
                        .data(data)
                        .style("opacity","1")
                        .style("stroke-width", "3");
                });
            }
            createTextOverlay(furtherSubgroups,"Professions","subGroupPanel");
        }else{
            
            var width= document.getElementById("my_dataviz").clientWidth*0.1;
            var height= document.getElementById("subGroupPanel").clientHeight;
            var PanelSVG = d3.select("#subGroupPanel").append("svg").attr("width", width).attr("height", height).attr("id", "subGroupPanelSVG");
            var subgroupNodes = PanelSVG.append("g")
                .selectAll("circle")
                .data(furtherSubgroups)
                .enter()
                .append("circle")
                .attr("class", "subgroupNodes")
                .attr("id", function (d) { return d.job})
                .attr("r", function (d) { return determineSubGroupSize(furtherSubgroups)})
                .attr("cx", function(d) {return width/2})
                .attr("cy", function (d) { return determineSubgroupY(d.job, d.count, furtherSubgroups)})
                .attr("fill", function(d) {
                      return "url(#bg" + findProfessionPicture(d,furtherSubgroups,svg,"sub")+")";
                })
            .attr("stroke", "white")
            .style("stroke-width",3)
            .on("mouseover", function (d) {createLines(d.job,data);}) 
            .on("click", function (d) {goToNextLevel(d.job)})
            .on("mouseleave", function (d) {
                d3.select("#my_dataviz")
                    .selectAll("circle")
                    .data(data)
                    .style("opacity","1")
                    .style("stroke-width", "3");
            });
            createTextOverlay(furtherSubgroups,"Professions","subGroupPanel");
        }
    }else{
        document.getElementById("subGroupOpen").style.display="none";
        closeSubgroupPanel();
        if(document.getElementById("subGroupPanelSVG")!=null){
            document.getElementById("subGroupPanelSVG").remove();
        }
    }
}

export {drawLowerLevel}