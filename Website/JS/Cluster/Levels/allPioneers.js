import {updateState} from '../Handlers/stateHandler.js';
import {determineCx,determineCy,} from '../Util/groupingUtil.js';
import {handleResize} from '../Handlers/resizeHandler.js';
import {setLevel} from '../Handlers/levelHandler.js';
import {getAllData} from '../Util/dataProcessing.js';
import {removeTooltip} from '../Util/tooltips.js';
import {showCountries} from '../Levels/CountryCluster.js';


function showAll(){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }    
    
    var data = getAllData()[0];
    window.zoomedIn=false;
    // set the dimensions and margins of the graph
    var width =document.getElementById("my_dataviz").clientWidth;
    var height = document.getElementById("my_dataviz").clientHeight;
    
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", "1000px")
    .attr("overflow","hidden")
  
      // create a tooltip
    var Tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
    
    if(document.getElementById("SlideTooltip")==null){
        var SlideTooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr("id", "SlideTooltip")
        .style("background-color", "#999")
        .style("color", "black")
        .style("border", "solid black")
        .style("border-width", "3px")
        .style("border-left-width", "0px")
        .style("padding", "5px")
        .style("position", "absolute")
    }else{
        var SlideTooltip= d3.select("#SlideTooltip");
    }
     

      // Three function that change the tooltip when user hover / move / leave a cell
  var mouseenter = function (d) {
      if(!zoomedIn){
          zoomIn(d,data,svg)
      }
  }

  var mouseover = function (d) {
        Tooltip
          .style("opacity", 1)
      }
   var mousemove = function (d) {
        Tooltip
          .html('<u>' + d.name + '</u>')
          .style("left", (d3.mouse(this)[0] + 20) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
   
   var mouseleave = function (d) {
        Tooltip
          .style("opacity", 0)
      }
   
   var mouseClick = function (d) {
       Tooltip
          .style("opacity", 0)
       zoomedIn=true;
       d3.selectAll("path").style("opacity", 0);
       if(zoomedIn){
            zoomIn(d,data,svg);
        }
      
       
       SlideTooltip
          .html('<button id ="closeTooltipButton">X</button><u><b>' + d.name + '</b></u>' + "<br>" +
               'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.<br>'+
               '<a href=' + d.link + '> Read More </a>')
          .style("width", "360px")
          .style("height", "167px")
          .style("left", (determineCx(d.number, width)+93)+"px")
          .style("top", determineCy(d.number, width)-53+"px")
          .style("border", "solid black")
          .style("border-width", "3px")
          .style("border-left-width", "0px")
          .style("padding", "5px")
          .style("opacity", 1);
       
       document.getElementById("closeTooltipButton").onclick=closeTooltip;
       var hoverNum=d.number;

       svg.selectAll("g")
        .data(data)
        .enter()
        .append("path")
        .attr("d",function(d){
           if(d.number==hoverNum){
              return getHalfpipePath(d.number, width);
           }else{
              return "";
           }
           
       })
        .style("stroke", "black")
        .style("fill","#999")
        .style("fill-opacity", 1)
        .style("stroke-width", "3px"); 
       
      }
  
  for(var i =0; i <data.length; i++){
      if(data[i].imgUrl.length!=0){
          var link = '../Images/WFPP-Pictures-Squares/' + data[i].name.split(' ').join('%20') +'.jpg';
      }else{
          var link = '../Images/WFPP-Pictures-Squares/Unknown.jpg';
      }
      
      
    svg.append("pattern")
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", 10)
	 .attr("height", 10)
     .attr("id", data[i].id)
     .append("image")
        .attr("x", 0)
        .attr("y", 0)
   	    .attr("width", 60)
        .attr("height", 60)
        .attr("xlink:href", link);  
}
  
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 30)
        .attr("cx",function(d) {return determineCx(d.number, width)})
        .attr("cy",function(d) {return determineCy(d.number, width)})
        .attr("fill", function(d) {
		      return "url(#"+d.id +")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 0.8)
        .on("click", mouseClick)
        .on("mouseenter", mouseenter)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
  
  
    
   var closeTooltip = function(d){
       d3.selectAll("path").style("opacity", 0);
       document.getElementById("SlideTooltip").style.opacity = 0;
       document.getElementById("SlideTooltip").innerHTML = "";
       document.getElementById("SlideTooltip").style.width = "0%";
       document.getElementById("SlideTooltip").style.border = "none";
       document.getElementById("SlideTooltip").style.padding = "0";
       zoomOut(d,data)
       window.zoomedIn=false;
    } 
   updateState("All");
   
}

window.addEventListener("resize", handleResize);


function findZoomInCx(elementNum, selectedNumber, width){
    var currentCx =determineCx(elementNum, width);
    if(elementNum==selectedNumber){
        return currentCx;
    }
    var circlesPerLine = Math.floor(width/70);
    var charge =5;
    var distance =0;
    
    var selectedLine = Math.floor(selectedNumber/(Math.floor(width/70)));
    var currentLine = Math.floor(elementNum/(Math.floor(width/70)));
    if(charge>Math.abs(selectedLine-currentLine)){
        if(selectedLine>currentLine){
            selectedNumber-=(selectedLine-currentLine)*circlesPerLine;
        }else{
            selectedNumber-=((selectedLine-currentLine)*circlesPerLine);
        }
    }
    
    var direction=Math.sign(elementNum-selectedNumber);
    var distance=Math.sqrt(Math.pow((elementNum-selectedNumber),2)+Math.pow(Math.abs(currentLine-selectedLine),2));
    if(Math.abs(distance)<charge){
        var newCx =(charge-Math.abs(distance))*10*direction + currentCx;
        
        if(distance==1){
            if(elementNum-selectedNumber==0){
                return newCx-35;
            }else{
                return newCx+direction*35;
            }
        }else{
            if(distance==2){
               if(elementNum-selectedNumber==0){
                   return newCx+35;
                }else{
                    return newCx-direction*35;
                } 
            }else{
                return newCx;
            }
        }
    }else{
        return currentCx;
    }
}



function findZoomInCy(elementNum, selectedNumber, width){
   var currentCy =determineCy(elementNum, width);
    if(elementNum==selectedNumber){
        return currentCy;
    }
    var circlesPerLine = Math.floor(width/70);
    var charge =5;
    var distance =0;
    
    var selectedLine = Math.floor(selectedNumber/(Math.floor(width/70)));
    var currentLine = Math.floor(elementNum/(Math.floor(width/70)));
    if(charge>Math.abs(selectedLine-currentLine)){
        if(selectedLine>currentLine){
            selectedNumber-=(selectedLine-currentLine)*circlesPerLine;
        }else{
            selectedNumber-=((selectedLine-currentLine)*circlesPerLine);
        }
    }
    
    var direction=Math.sign(currentLine-selectedLine);
    var distance=Math.sqrt(Math.pow((elementNum-selectedNumber),2)+Math.pow(Math.abs(currentLine-selectedLine),2));
    if(Math.abs(distance)<charge){
        var newCy =(charge-Math.abs(distance))*10*direction + currentCy;
        
        if(distance==1){
            if(elementNum-selectedNumber==0){
                return newCy+direction*30;
            }else{
                return newCy-35;
            }
        }else{
            if(distance==2){
               if(elementNum-selectedNumber==0){
                   return newCy-direction*30;
                }else{
                    return newCy+35;
                } 
            }else{
                return newCy;
            }
        }
    }else{
        return currentCy;
    }
}


function getHalfpipePath(number, width){
    var cx = determineCx(number,width);
    var cy = determineCy(number,width);
    return "m "+ (cx+95) + " " + (cy+90) + " h -95 a 45 45 0 0 0 0 -180.5 h 95"
}



function zoomIn(d,data,svg){
    var hoverID=d.id;
    var hoverNum=d.number;
    var width =document.getElementById("my_dataviz").clientWidth;
    
    if(d.imgUrl.length!=0){
        var link = '../Images/WFPP-Pictures-Squares/' + d.name.split(' ').join('%20') +'.jpg';
    }else{
          var link = '../Images/WFPP-Pictures-Squares/Unknown.jpg';
    }
      
      svg.append("pattern")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
 	    .attr("height", 10)
        .attr("id", hoverID+"m")
        .append("image")
        .attr("x", 0)
        .attr("y", 0)
   	    .attr("width", "180")
        .attr("height", "180")
        .attr("xlink:href", link); 
    
       d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .transition()
        .duration(20)
        .attr("r", function(d)
               {if(hoverID==d.id){
                    return 90;
               }else{
                    return 30;
                }})
        .attr("cx", function(d){ return findZoomInCx(d.number, hoverNum, width)})
        .attr("cy", function(d){ return findZoomInCy(d.number, hoverNum, width)})
        .style("fill", function(d)
               {if(hoverID==d.id){
                    return "url(#"+d.id +"m)"}})  
        .style("stroke-width", function(d)
               {if(hoverID==d.id){
                    return "3px"}})  
}

function zoomOut(d,data){
    var hoverID=d.id;
    var hoverNum=d.number;
    var width =document.getElementById("my_dataviz").clientWidth;
 
    d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .transition()
        .duration(20)
        .attr("r", 30)
        .attr("cx", function(d){ return determineCx(d.number, width)})
        .attr("cy", function(d){ return determineCy(d.number, width)})
        .style("fill", function(d)
               {if(hoverID==d.id){
                    return "url(#"+d.id +")"}})     
}

export{showAll}