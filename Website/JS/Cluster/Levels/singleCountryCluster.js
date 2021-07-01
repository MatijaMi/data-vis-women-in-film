import {showCountries} from './CountryCluster.js';
import{speedUpAnimation} from '../Util/tooltips.js';
import{goBackState} from '../Handlers/stateHandler.js';

function showCountryD3(country,timespan){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
    var data = "id,name,link,imgUrl,real,country,number\r\n";
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_in.length; j++){
            var entry=wfpp.entries[i].worked_in[j];
            var link =  wfpp.entries[i].link;
            var img_url = wfpp.entries[i].image_url;
            var id = wfpp.entries[i].id;
            var name = wfpp.entries[i].name;
            var diedIn = wfpp.entries[i].YOD;
            var start = timespan.substr(0,4);
            if(timespan!=""){
                if(entry == country && Number.parseInt(diedIn)>start){
                data+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n"
                }
            }else{
            if(entry == country){
                data+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n"
                }
            }
        }
    }

    data = d3.csvParse(data);

    // set the dimensions and margins of the graph
    var width =document.getElementById("my_dataviz").clientWidth;
    var height = document.getElementById("my_dataviz").clientHeight;
    
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    
    // Size scale for countries
    var size = d3.scaleLinear()
            .domain([0, 300])
            .range([7, 55])  // circle will be between 7 and 55 px wide
  
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
    
    var backButton = d3.select("body")
        .append("div")
        .style("opacity", 1)
        .attr("class", "back")
        .attr("id", "back")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .style("left", width -90 + "px")
        .style("top", height -40 + "px")
        .html("<button> Back </button>")

    function goBack(){
        Tooltip
          .style("opacity", 0)
          .style("width",0)
          .style("border",0)
          .style("padding", 0)
          .html("");
        document.getElementById("back").remove();
        showCountries("");    
    }
    
document.getElementById("back").addEventListener("click", goBack)
      // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
        Tooltip
          .style("opacity", 1)
          .style("width","auto")
          .style("border","solid")
          .style("padding", "5px")
      }
  
   var mousemove = function (d) {
       var x  =d3.mouse(this)[0];
       var y = d3.mouse(this)[1];
      if(d.real="real"){
          if(d.imgUrl.length<10){
              Tooltip
          .html('<u><b>' + d.name + '</b></u>' + "<br>" +
                '<img src=../Images/WFPP-Pictures-Squares/Unknown.jpg width=200px>'+
               'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.<br>'+
               '<a href=' + d.link + '> Read More </a>')
          .style("width", "240px")
          .style("left", (d3.mouse(this)[0] + 20) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
          }else{
           Tooltip
          .html('<u><b>' + d.name + '</b></u>' + "<br>" +
                '<img src=../Images/WFPP-Pictures-Squares/'+ d.name.split(' ').join('%20') +'.jpg width=200px>')
          .style("width", "240px")
          .style("left", (d3.mouse(this)[0] + 20) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
            }
      }else{
           Tooltip
          .html('<u>' + d.name + '</u>' + "<br>" + d.name)
          .style("left", (x + 20) + "px")
          .style("top", y + "px")  
      }
    }
  var mouseleave = function (d) {
        Tooltip
          .style("opacity", 0)
          .style("width",0)
          .style("border",0)
          .style("padding", 0)
          .html("");
      }
  var radiusofGroup=determineCountryGroupSize(data);
  var extra="-Fullsize";
    if(data.length>100){
        extra=""
    }
 for(var i =0; i <data.length; i++){
      if(data[i].imgUrl.length!=0){
          var link = '../Images/WFPP-Pictures-Squares/' + data[i].name.split(' ').join('%20') +'.jpg';
      }else{
          var link = '../Images/WFPP-Pictures-Squares/Unknown.jpg';
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
   	    .attr("width", function (d) { return 2*radiusofGroup})
        .attr("height", function (d) { return 2*radiusofGroup})
        .attr("xlink:href", link);  
}
  
      // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", radiusofGroup)
        .attr("cx",0)
        .attr("cy", 0)
        .attr("fill", function(d) {
		      return "url(#"+d.id +")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 0.8)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



      // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of 
        .force('y', d3.forceY().y(height/2).strength(0.010))
        .force("collide", d3.forceCollide().strength(.5).radius(radiusofGroup).iterations(1))
      // Force that avoids circle overlapping

  //
      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        });

    speedUpAnimation(simulation,2);

    function determineCountryGroupSize(){
        if(data.length>40){
            return 30;
        }
        if(data.length>10 && data.length<40){
            return 60;
        }
        if(data.length<10){
            return 80;
        }
    }
}

export {showCountryD3}