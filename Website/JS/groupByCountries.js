import {determineColor,determineCx,determineCy,handleResize,findNewIndex,updateState} from './groupingUtil.js';
import {getCountryData, getPreviousData} from './dataProcessing.js';

function groupByCountry(mode){
    
    var width = window.innerWidth;
    var height = window.innerHeight - 50;
    var newData = getCountryData()[0];
    var countries = getCountryData()[1];
    
    if(mode=="resize"){
        if(document.getElementById("my_dataviz").firstChild!=null){
            document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
        }
    var data = "id,name,link,imgUrl,workedIn,real,number\r\n";
    for(var i = 0; i <newData.length; i++){
        var id = newData[i].id;
        var name = newData[i].name;
        var workedIn = newData[i].worked_in
        var link =  newData[i].link;
        var img_url = newData[i].image_url;
        data+= id + "," + name + "," +link + "," + img_url + "," + workedIn[0] +  "," + "real," + i +"\r\n" 
    }
    data = d3.csvParse(data);
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("id", "#mainSVG")
    .attr("width", width)
    .attr("height", "2000px");
  
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
    

      // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
        Tooltip
          .style("opacity", 1)
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
       
      }
   
  var mouseleave = function (d) {
        
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
        .attr("cx",function(d) {return determineCx(d.number, width)})
        .attr("cy",function(d) {return determineCy(d.number, width)})
        .attr("fill", function(d) {
		      return "url(#"+d.id +")";
        })
        .attr("stroke", function(d){ return determineColor(d.id, newData, countries, "country")})
        .style("stroke-width", 2)
        .on("mouseleave", mouseleave)
        .on("click", mouseClick)
    }else{
    d3.select("#my_dataviz")
        .selectAll("circle")
        .data(getPreviousData()[0])
        .transition()
        .duration(1000)
        .attr("cx",function(d) {return determineCx(findNewIndex(d.id, newData), width)})
        .attr("cy",function(d) {return determineCy(findNewIndex(d.id, newData), width)})
        .attr("stroke", function(d){ return determineColor(d.id, newData, countries, "country")})
        .style("stroke-width", 2)
     }
    updateState("Countries");
}

export{groupByCountry}