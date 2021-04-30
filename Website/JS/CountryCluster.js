import{updateState} from './groupingUtil.js';
import{showCountryD3} from './singleCountryCluster.js';

function showCountries(){
    
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
    
    var countryData= new Map();
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_in.length; j++){
            var entry=wfpp.entries[i].worked_in[j];
                if(countryData.has(entry)){
                    var value = countryData.get(entry)+1;
                    countryData.set(entry,value);
                }else{
                    countryData.set(entry,1);
                }        
            } 
        } 
    //console.log(wfpp.entries)
    var data = "country,count\r\n";

    countryData.forEach((value,key)=>{ 
          data+= key + "," + value + "\r\n"
        });

    data = d3.csvParse(data);

    // set the dimensions and margins of the graph
    var width = window.innerWidth;
    var height = window.innerHeight - 50;
    
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
      }
  var freq = new Set();
    countryData.forEach((value,key)=>{
    svg.append("pattern")
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", 10)
	 .attr("height", 10)
     .attr("id", function (d) { return "bg" +key.split(' ').join('-')})
     .append("image")
       .attr("x", 0)
       .attr("y", 0)
   			.attr("width", function (d) { return 2 * determineCountrySize(value)})
			.attr("height", function (d) { return 2* determineCountrySize(value)})
   .attr("xlink:href", findCountryPicture(key,value));
});
    
   var showCountry = function (d) { 
       showCountryD3(d.country)
       Tooltip.style("opacity", 0)
    }
  
      // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function (d) { return determineCountrySize(d.count)})
        .attr("cx",0)
        .attr("cy", 0)
        .attr("fill", function(d) {
		      return "url(#bg" + d.country.split(' ').join('-')+")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", function (d) {showCountry(d)})
        //.call(d3.drag() // call specific function when circle is dragged
          //.on("start", dragstarted)
          //.on("drag", dragged)
          //.on("end", dragended));



      // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-2)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return determineCountrySize(d.count)}).iterations(1)) // Force that avoids circle overlapping

  //
      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        });

      // What happens when a circle is dragged?
  function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
  function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
  function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
      }
    updateState("Countries");
}



function findCountryPicture(country,count){
    var rand = count;
    
    if(rand>1){
        rand =Math.floor((Math.random() * count) + 1);
    }
    
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_in.length; j++){
            var entry=wfpp.entries[i].worked_in[j];
            if(entry.includes(country)){
                if(rand==1){
                    if(wfpp.entries[i].image_url.length!=0){
                        if(count>20){
                            return '../Images/WFPP-Pictures-Fullsize/' + wfpp.entries[i].name.split(' ').join('%20') +'.jpg';
                        }else{
                           return '../Images/WFPP-Pictures/' + wfpp.entries[i].name.split(' ').join('%20') +'.jpg'; 
                        }  
                    }
                }else{
                    rand--;
                }
            }
        }
    }
    if(count>20){
        return '../Images/WFPP-Pictures-Fullsize/Unknown.webp';;
    }else{
        return '../Images/WFPP-Pictures/Unknown.jpg'; 
    }
}

function determineCountrySize(count){
    
    if(count<10){
        return 45;
    }else{
        if(count<20 && count >=10){
            return 60;
        }else{
            if(count<50 && count >20){
                return 75;
            }else{
                return count;
            }
        }
    }
}


export {showCountries}