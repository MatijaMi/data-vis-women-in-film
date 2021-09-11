import{updateState,goBackState,initializeStates,getStates} from '../Handlers/stateHandler.js';
import{getTopLevelData} from '../Util/dataProcessing.js';
import{mouseoverJob,mousemoveJob,mouseleaveJob} from '../Handlers/mouseHandler.js';
import{removeTooltip,createTooltip,createTextOverlay,speedUpAnimation} from '../Util/tooltips.js';
import{updateLevel,getLevels,getLevel,setLevel,goToNextLevel} from '../Handlers/levelHandler.js';
import{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,determineCxMobile,determineCyMobile,determineJobSizeMobile} from '../Util/bubbleUtil.js';
import{setLocator, handleLocatorClick, removeLastLocButton,addButtonEvents,updateLocator} from '../Handlers/navigationHandler.js';
import{drawLowerLevel} from '../Levels/lowerLevels.js';
import{showCountries} from '../Levels/CountryCluster.js';
import{showAll} from '../Levels/allPioneers.js';
import{closeSubgroupPanel,timeouts,openSubgroupPanel} from '../Handlers/connectivityHandler.js';
window.simulation;
function drawTopLevel(){
//Preparation
    clearPrevDataviz();
    
    var data = getTopLevelData();
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
    
    for(var i =25; i <wfpp.entries.length ;i++){
        var pioneer = wfpp.entries[i];
    }
    var svg = d3.select("#my_dataviz").append("svg").attr("width", width).attr("height", height).attr("id","mainSVG");

//Drawing the circles
    
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

//Simulation of the forces
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
                createTextOverlay(data,"Professions","my_dataviz");
            }
        });
        speedUpAnimation(window.simulation,2);
    }else{
        createTextOverlay(data,"Professions","my_dataviz");
    }
    
    
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
    
    //Temp function just to fix a bug that occurs due to unexplained reasons
    function temp(){
        d3.selectAll("circle").transition().duration(0).attr("fill-opacity","0.33");
        d3.selectAll("circle").transition().duration(0).attr("fill-opacity","1");
        
        timeouts.push(setTimeout(resetTimer,10));
    }
    
    timeouts.push(setTimeout(temp,10000));
    setLevel(0);
    updateState("Professions");
    var statePosition = getStates().length;
    setLocator("Professions");
    closeSubgroupPanel();
}


export {drawTopLevel}