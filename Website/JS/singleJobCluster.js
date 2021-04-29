import {showProfessions} from './jobCluser.js';

function showJobD3(profession){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
    var data = "id,name,link,imgUrl,real,job,number\r\n";
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.includes(">")){
                entry= entry.substr(entry.indexOf(">")+1);
                var link =  wfpp.entries[i].link;
                var img_url = wfpp.entries[i].image_url;
                var id = wfpp.entries[i].id;
                var name = wfpp.entries[i].name;
                if(entry == profession){
                    data+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n"
                }
                     
            } 
        }
    }

    data = d3.csvParse(data);

    // set the dimensions and margins of the graph
    var width = window.innerWidth;
    var height = window.innerHeight - 50;
    
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
        showProfessions();
        document.getElementById("back").remove()
    }
    
document.getElementById("back").addEventListener("click", goBack)
      // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
        Tooltip
          .style("opacity", 1)
      }
   var mousemove = function (d) {
       var x  =d3.mouse(this)[0];
       var y = d3.mouse(this)[1];
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
               '<button> Other Professions </button>')
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
      }
  
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
  
      // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 30)
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
      .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of value is > 0
      // Force that avoids circle overlapping

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
}

export {showJobD3}