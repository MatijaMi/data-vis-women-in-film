import{updateState, getStates} from '../Handlers/stateHandler.js';
import{showCountryD3} from './singleCountryCluster.js';
import {setLevel} from '../Handlers/levelHandler.js';
import {removeTooltip,createTextOverlay} from '../Util/tooltips.js';
import {addPatterns,determineCountrySize,findCountryPicture} from '../Util/bubbleUtil.js';
import{clearAllTimeouts,timeouts} from '../Handlers/connectivityHandler.js';

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
    //console.log(wfpp.entries)
    var data = "country,count\r\n";

    countryData.forEach((value,key)=>{ 
          data+= key + "," + value + "\r\n";
        });

    data = d3.csvParse(data);
    // set the dimensions and margins of the graph
    var width =document.getElementById("my_dataviz").clientWidth;
    var height = document.getElementById("my_dataviz").clientHeight;
    
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    
    
  
      // create a tooltip
    var Tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

      // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
       Tooltip
          .style("opacity", 1)
          .style("width","auto")
          .style("border","solid")
          .style("padding", "5px")
      }
  var mousemove = function (d) {
        Tooltip
          .html('<u>' + d.country + '</u>' + "<br>" + d.count)
          .style("left", (d3.mouse(this)[0] + 20) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
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
  var mouseenter = function (d) {
        createLines(d.country, data)
      }
    
   var showCountry = function (d) { 
       updateState(d.country);
       showCountryD3(d.country,"")
       var paras = document.getElementsByClassName('tooltip2');

        while(paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
       Tooltip.style("opacity", 0)
    }
  
      // Initialize the circle: all located at the center of the svg area
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
        .on("mouseenter", mouseenter)
        .on("mouseleave", mouseleave)
        .on("click", function (d) {removeTooltip("textOverlay");showCountry(d)})
        //.call(d3.drag() // call specific function when circle is dragged
          //.on("start", dragstarted)
          //.on("drag", dragged)
          //.on("end", dragended));



      // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2 -50)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-2)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return determineCountrySize(d.count)}).iterations(1))
        .force('y', d3.forceY().y(height/2).strength(0.02));// Force that avoids circle overlapping

  //
      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        }).on('end', function () {
            createTextOverlay(data,"Countries","body");}
        );
    
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
}

/////////////////////////////////////////////////////////////////
function createLines(country,data){
    var simCountries = new Set();
    simCountries.add(country)
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_in.length; j++){
            var entry=wfpp.entries[i].worked_in[j];
            if(entry.includes(country)){
                for(var k =0; k< wfpp.entries[i].worked_in.length; k++){
                    var entry=wfpp.entries[i].worked_in[k];
                    simCountries.add(entry);
                }
                
            }
        }
    }
    var arr = Array.from(simCountries);
    d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .style("opacity", function(){if(arr.includes(d3.select(this).attr('id'))){
        return 1;}else{return 0.3;}})
        .style("stroke-width", function(){if(arr.includes(d3.select(this).attr('id'))){
        return "4px";}else{return 2;}})
    
    simCountries.delete(country);
    var arr = Array.from(simCountries);
    for(var i =0; i< arr.length;i++){
        if(document.getElementById(arr[i])!=null){
            var x = document.getElementById(arr[i]).cx.baseVal.value;
            var y = document.getElementById(arr[i]).cy.baseVal.value;
            var r = document.getElementById(arr[i]).r.baseVal.value;
            var Tooltip = d3.select("body")
                .append("div")
                .html('<u>' + arr[i] + '</u>')
                .style("opacity", 1)
                .attr("class", "tooltip2")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("position", "absolute")
                .style("left", x-arr[i].length*4 + "px")
                .style("top", y-r+10 + "px")  
        }
    }
}


export {showCountries}