import {determineColor,determineCx,determineCy,handleResize,updateState} from './groupingUtil.js';
import {getAllData, getPreviousData} from './dataProcessing.js';
import {groupByCountry} from './groupByCountries.js';
import {groupByProfession} from './groupByProfession.js';

function showAll(){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
    
    var data = getAllData()[0];

    // set the dimensions and margins of the graph
    var width = window.innerWidth;
    var height = window.innerHeight - 50;
    
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", "2000px")
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
    
     var SlideTooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr("id", "SlideTooltip")
        .style("background-color", "black")
        .style("color", "white")
        .style("border", "solid black")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
    

      // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
        SlideTooltip
          .style("opacity", 1)
        var hoverID=d.id;
        var hoverNum=d.number;
       d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .transition()
        .duration(30)
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
                    return "blue"}})
     }

   var mousemove = function (d) {       
      if(d.real="real"){
          if(d.imgUrl.length<10){
              Tooltip
          .html('<u><b>' + d.name + '</b></u>' + "<br>" +
                '<img src=../Images/WFPP-Pictures-Fullsize/Unknown.webp width=200px>'+
               'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.<br>'+
               '<a href=' + d.link + '> Read More </a>')
          .style("width", "240px")
          .style("left", (d3.mouse(this)[0] + 20) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
          }else{
           Tooltip
          .html('<u><b>' + d.name + '</b></u>' + "<br>" +
                '<img src=../Images/WFPP-Pictures-Fullsize/'+ d.name.split(' ').join('%20') +'.jpg width=200px>'+
               'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.<br>'+
               '<a href=' + d.link + '> Read More </a>')
          .style("width", "240px")
          .style("left", (d3.mouse(this)[0] + 20) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
            }
      }else{
           Tooltip
          .html('<u>' + d.name + '</u>' + "<br>" + d.name)
          .style("left", (d3.mouse(this)[1] + 20) + "px")
          .style("top", d3.mouse(this)[0] + "px")  
      }
      }
      
   var mouseClick = function (d) {
       SlideTooltip
          .html('<u><b>' + d.name + '</b></u>' + "<br>" +
               'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.<br>'+
               '<a href=' + d.link + '> Read More </a>')
          .style("width", "360px")
          .style("height", "150px")
          .style("animation-duration", "3s")
          .style("animation-name","slidein")
          .style("padding-left", "60px")
          .style("left", (determineCx(d.number, width)+35)+"px")
          .style("top", determineCy(d.number, width)-45+"px")
      }
   
  var mouseleave = function (d) {
      SlideTooltip.style("opacity", 0);
        showAll();
      }
      // Initialize the circle: all located at the center of the svg area
  
  for(var i =0; i <data.length; i++){
      if(data[i].imgUrl.length!=0){
          var link = '../Images/WFPP-Pictures/' + data[i].name.split(' ').join('%20') +'.jpg';
      }else{
          var link = '../Images/WFPP-Pictures/Unknown.jpg';
      }
      
    svg.append("pattern")
     .data(data)
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", 10)
	 .attr("height", 10)
     .attr("id", data[i].id)
     .append("image")
        .attr("x", 0)
        .attr("y", 0)
   	    .attr("width", function (d) { return 60})
        .attr("height", function (d) { return 60})
        .attr("xlink:href", link);  
}
  
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 30)
        .attr("x",function(d) {return determineCx(d.number, width)})
        .attr("y",function(d) {return determineCy(d.number, width)})
        .attr("cx",function(d) {return determineCx(d.number, width)})
        .attr("cy",function(d) {return determineCy(d.number, width)})
        .attr("fill", function(d) {
		      return "url(#"+d.id +")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 0.8)
        .on("mouseleave", mouseleave)
        .on("click", mouseClick)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
  
  
  
  
  updateState("All");
}



showAll();
function removeTooltip(){
    //document.getElementById("tooltip").style.opacity=0;
}

document.getElementById("my_dataviz").addEventListener("click",removeTooltip);
window.addEventListener("resize", handleResize);
document.getElementById("show-all-button").addEventListener("click",showAll);
document.getElementById("groupBy-country").addEventListener("click", groupByCountry);
document.getElementById("groupBy-profession").addEventListener("click", groupByProfession);



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












export{showAll}