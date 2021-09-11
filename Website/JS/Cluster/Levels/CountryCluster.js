import{updateState, getStates} from '../Handlers/stateHandler.js';
import{showCountryD3} from './singleCountryCluster.js';
import {setLevel} from '../Handlers/levelHandler.js';
import {removeTooltip,createTextOverlay,createTooltip,speedUpAnimation} from '../Util/tooltips.js';
import {determineCountrySize,findCountryPicture,determineJobSizeMobile,determineCxMobile,determineCyMobile} from '../Util/bubbleUtil.js';
import{clearAllTimeouts,timeouts} from '../Handlers/connectivityHandler.js';
import{setLocator,updateLocator} from '../Handlers/navigationHandler.js';



function showCountries(timespan){
    
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
    
    var countryData= new Map();
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_in.length; j++){
            var entry=wfpp.entries[i].worked_in[j];
            if(entry.length>0){
                var diedIn = wfpp.entries[i].YOD;
                if(timespan!=""){
                    var start = timespan.substr(0,4);
                    if(Number.parseInt(diedIn)<start){
                        continue;
                    }   
                }
                if(countryData.has(entry)){
                    var value = countryData.get(entry)+1;
                    countryData.set(entry,value);
                }else{
                    countryData.set(entry,1); 
                }
            }
        } 
    } 
    var data = "country,count\r\n";

    countryData.forEach((value,key)=>{ 
          data+= key + "," + value + "\r\n";
        });

    data = d3.csvParse(data);
    // set the dimensions and margins of the graph
    var width =document.getElementById("my_dataviz").clientWidth;
    
    if(mobileMode){
        var heightSVG =150 + (width/4)* Math.ceil(data.length/4);
        document.getElementById("my_dataviz").style.height="100%";
        var heightDIV = document.getElementById("my_dataviz").clientHeight;
        var height =Math.max(heightSVG,heightDIV);
        document.getElementById("my_dataviz").style.height=height+"px";
        
    }else{
        document.getElementById("my_dataviz").style.height="100%";
        var height = document.getElementById("my_dataviz").clientHeight;  
    }
    
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    
      // create a tooltip
    var Tooltip = createTooltip();

      // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
       Tooltip
          .style("opacity", 1)
          .style("width","auto")
          .style("border","solid")
          .style("padding", "5px")
      }
  var mousemove = function (d) {
      var text = "Pioneers";
      if(d.count==1){
          text="Pioneer";
      }
        Tooltip
          .html(d.count + "<br>" + text)
          .style("left", (d3.mouse(this)[0] + 15) + "px")
          .style("top", (d3.mouse(this)[1] +30) + "px")
      }
  var mouseleave = function (d) {
        Tooltip
          .style("opacity", 0)
          .style("width",0)
          .style("border",0)
          .style("padding", 0)
          .html("");
      
        d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .style("opacity", 1)
        .style("stroke-width", 2);
      var paras = document.getElementsByClassName('tooltip2');

      while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
        }
      }
    
   var showCountry = function () { 
       var country = event.srcElement.id;
       updateState(country);
       updateLocator(country,1);
       clearAllTimeouts();
       showCountryD3(country,"")
       var paras = document.getElementsByClassName('tooltip2');

        while(paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
       Tooltip.style("opacity", 0)
    }
  
      if(mobileMode){
          for(var i= 0; i <data.length; i++){
              var node = svg.append("g")
                .data(data)
                .append("circle")
                .attr("class", "node")
                .attr("id", function(d){return data[i].country})
                .attr("r", function (d) { return determineJobSizeMobile()})
                .attr("cx",function (d){return determineCxMobile(i)})
                .attr("cy",function (d){return determineCyMobile(i)})
                .attr("fill", function(d) {
                      return "url(#bg" + findCountryPicture(data[i].country,data[i].count,svg) +")";
                })
                .attr("stroke", "black")
                .style("stroke-width", 3)
                .on("click", function (d) {removeTooltip("textOverlay");showCountry()})
            }
      }else{
      var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("id", function(d){return d.country})
            .attr("r", function (d) { return determineCountrySize(d.count)})
            .attr("cx",0)
            .attr("cy", 0)
            .attr("fill", function(d) {
                  return "url(#bg" + findCountryPicture(d.country,d.count,svg) +")";
            })
            .attr("stroke", "black")
            .style("stroke-width", 3)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", function (d) {removeTooltip("textOverlay");showCountry()})
    }
  if(!mobileMode){
      // Features of the forces applied to the nodes:
  window.simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-2)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return determineCountrySize(d.count)}).iterations(1))
        .force('y', d3.forceY().y(height/2).strength(0.04));

  //
    window.simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        }).on('end', function () {
            if(getStates().length == statePosition ){
                createTextOverlay(data,"Countries","my_dataviz");}
        }
        );
      speedUpAnimation(window.simulation,2);
  }else{
       createTextOverlay(data,"Countries","my_dataviz");
  }
    function changePattern(){
        if(getStates()[getStates().length-1]=="Countries"){
            d3.selectAll("circle").attr("fill", function(d) {
		      return "url(#bg" + findCountryPicture(d.country,d.count,svg)+")";
            });
            d3.selectAll("circle").transition().duration(1000).attr("fill-opacity","1.0");
           timeouts.push(setTimeout(resetTimer,5000));
        }
    }
       
    function resetTimer(){
        if(getStates()[getStates().length-1]=="Countries"){
            d3.selectAll("circle").transition().duration(1000).attr("fill-opacity","0.33");
               timeouts.push(setTimeout(changePattern,1000));
        }
    }
    
    //Temp function just to fix a bug that occurs due to unexplained reasons
    function temp(){
        if(getStates()[getStates().length-1]=="Countries"){
            d3.selectAll("circle").transition().duration(0).attr("fill-opacity","0.33");
            d3.selectAll("circle").transition().duration(0).attr("fill-opacity","1");
            timeouts.push(setTimeout(resetTimer,10));
        }
    }
    
    timeouts.push(setTimeout(temp,10000));
    updateState("Countries");
    var statePosition = getStates().length;
    setLocator("Countries");
}


export {showCountries}