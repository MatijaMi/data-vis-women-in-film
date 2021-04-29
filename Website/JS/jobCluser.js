import{showJobD3}  from './singleJobCluster.js';
import{updateState} from './groupingUtil.js';

function showProfessions(){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
    
    var jobData= new Map();
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.includes(">")){
                entry= entry.substr(entry.indexOf(">")+1);
                if(jobData.has(entry)){
                    var value = jobData.get(entry)+1;
                    jobData.set(entry,value);
                }else{
                    jobData.set(entry,1);
                }        
            } 
        }
    } 
    //console.log(wfpp.entries)
    var data = "job,count\r\n";

    jobData.forEach((value,key)=>{ 
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
      }
  var mousemove = function (d) {
        Tooltip
          .html('<u>' + d.job + '</u>' + "<br>" + d.count)
          .style("left", (d3.mouse(this)[0] + 20) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
  var mouseleave = function (d) {
        Tooltip
          .style("opacity", 0)
      }
  
  var freq = new Set();
    jobData.forEach((value,key)=>{
    svg.append("pattern")
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", 10)
	 .attr("height", 10)
     .attr("id", function (d) { return "bg" +key.split(' ').join('-')})
     .append("image")
       .attr("x", 0)
       .attr("y", 0)
   			.attr("width", function (d) { return 2 * Math.max(30,value)})
			.attr("height", function (d) { return 2 * Math.max(30,value)})
   .attr("xlink:href", findProfessionPicture(key,value));
        console.log(findProfessionPicture(key,value));
});
    
   var showJob = function (d) { 
       showJobD3(d.job)
       Tooltip.style("opacity", 0)
    }
  
      // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function (d) { return Math.max(30,d.count)})
        .attr("cx",0)
        .attr("cy", 0)
        .attr("fill", function(d) {
		      return "url(#bg" + d.job.split(' ').join('-')+")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", function (d) {showJob(d)})
        //.call(d3.drag() // call specific function when circle is dragged
          //.on("start", dragstarted)
          //.on("drag", dragged)
          //.on("end", dragended));



      // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-2)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return Math.max(30,d.count)+3}).iterations(1)) // Force that avoids circle overlapping

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
    updateState("Professions");
}



function findProfessionPicture(job,count){
    var rand = count;
    if(rand>1){
        rand =Math.floor((Math.random() * count) + 1);
    }
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.includes(job)){
                if(rand==1){
                    if(wfpp.entries[i].image_url.length!=0){
                        if(count>50){
                            return '../Images/WFPP-Pictures-Fullsize/' + wfpp.entries[i].name.split(' ').join('%20') +'.jpg';
                        }else{
                           return '../Images/WFPP-Pictures/' + wfpp.entries[i].name.split(' ').join('%20') +'.jpg'; 
                        }
                        
                    }else{
                        if(count>50){
                            return '../Images/WFPP-Pictures-Fullsize/Unknown.webp';;
                        }else{
                           return '../Images/WFPP-Pictures/Unknown.jpg'; 
                        }
                        
                    }
                }else{
                    rand--;
                }
            }
        }
    }
}


export {showProfessions}