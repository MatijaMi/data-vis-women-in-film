import {updateState} from '../Handlers/stateHandler.js';
import {handleResize} from '../Handlers/resizeHandler.js';
import {setLevel} from '../Handlers/levelHandler.js';
import {getAllData} from '../Util/dataProcessing.js';
import {removeTooltip,createTooltip} from '../Util/tooltips.js';
import {showCountries} from '../Levels/CountryCluster.js';
import{setLocator} from '../Handlers/navigationHandler.js';
import{mousemovePersonal,mouseoverPersonal,mouseleavePersonal,mouseClickPersonal,showMobileTooltipPanel} from '../Handlers/mouseHandler.js';
function showAll(){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }    
    
    var data = getAllData()[0];
   
    window.zoomedIn=false;
    // set the dimensions and margins of the graph
    var width =document.getElementById("my_dataviz").clientWidth;
    var heightSVG =50 + 70 * Math.ceil(data.length/Math.floor(width/70));
    var heightDIV = document.getElementById("my_dataviz").clientHeight;
    var height =Math.max(heightSVG,heightDIV);
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    document.getElementById("my_dataviz").style.overflow="";
    document.getElementById("my_dataviz").style.height=height+"px";
      // create a tooltip
    var Tooltip =createTooltip();
     
      // Three function that change the tooltip when user hover / move / leave a cell
  var mouseenter = function (d) {
      if(!zoomedIn){
          zoomIn(d,data,svg)}
  }
  
   // TODO Get smaller images for all page
  for(var i =0; i <data.length; i++){
      if(data[i].imgUrl.length!=0){
          var link = '../Images/WFPP-Pictures-Small/' + data[i].name.split(' ').join('%20') +'.jpg';
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
    
    svg.on("leave", zoomOut(data));
  if(mobileMode){
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
        .on("click", function (d) {showMobileTooltipPanel(d)});
  }else{
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
        .on("click", function (d) {window.zoomedIn=true;mouseClickPersonal(Tooltip, data)})
        .on("mouseenter", mouseenter)
        .on("mouseover", function (d) {mouseoverPersonal(Tooltip);}) 
        .on("mousemove", function (d) {mousemovePersonal(Tooltip,d, this)})
        .on("mouseleave", function (d) {mouseleavePersonal(Tooltip,data)})
  }
   updateState("All");
   setLocator("All Pioneers"); 
}

window.addEventListener("resize", handleResize);



//TODO Add comments explainging this
function determineCx(index, width){
    var count = Math.floor(width/70);
    var pad = (width- count*70-40)/2;
    return Math.floor(index%(Math.floor(width/70)))*70+40+pad;
}

function determineCy(index, width){
    return Math.floor(index/(Math.floor(width/70)))*70+80;
}

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

function zoomOut(data){
    var width =document.getElementById("my_dataviz").clientWidth;
 
    d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .transition()
        .duration(20)
        .attr("r", 30)
        .attr("cx", function(d){ return determineCx(d.number, width)})
        .attr("cy", function(d){ return determineCy(d.number, width)})
        .style("fill", function(d){return "url(#"+d.id +")"});     
}

export{showAll}