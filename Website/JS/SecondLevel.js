import{updateState,updateLevel,getLevels,getLevel,removeTooltip,setLevel,setLocator,updateLocator} from './groupingUtil.js';
import{drawFirstLevel} from './firstLevel.js';
import{drawThirdLevel} from './ThirdLevel.js';

function drawSecondLevel(profession){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
    
    var levels = getLevels();
    
    
    
    //COLLECT PEOPLE
    var jobData= new Map();
    var persData = "id,name,link,imgUrl,real,job,number\r\n";
    for(var i = 0; i <wfpp.entries.length; i++){
         var personsJobs = new Set();
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            var link =  wfpp.entries[i].link;
            var img_url = wfpp.entries[i].image_url;
            var id = wfpp.entries[i].id;
            var name = wfpp.entries[i].name;
            if(entry.includes(">")){
                entry=entry.substr(entry.indexOf(">")+1);
                if(entry.includes(">")){
                    var rest = entry.substr(entry.indexOf(">")+1);
                    entry=entry.substr(0,entry.indexOf(">"));
                    if(entry==profession){
                       persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n";
                        if(rest.includes(">")){
                            rest=rest.substr(0,rest.indexOf(">"));
                        }
                        personsJobs.add(rest);
                    }
                }else{
                   if(entry==profession){
                      persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n"; 
                   } 
                }
            }else{
                if(levels[0].has(entry) && entry==profession){
                    persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n"; 
                }
                if(!levels[0].has(entry)){
                    if(entry==profession){
                        persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n";
                    }
                }
                
            }
        }
        personsJobs.forEach((entry)=>{
                if(jobData.has(entry)){
                    var value = jobData.get(entry)+1;
                    jobData.set(entry,value);
                }else{
                    jobData.set(entry,1);
                }  
            });
    }
    
    var personalData = d3.csvParse(persData);
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
          .style("width","auto")
          .style("border","solid")
          .style("padding", "5px")
      }
  
    var mouseenter = function (d) {
      createLines(d.job, data)
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
          .style("width",0)
          .style("border",0)
          .style("padding", 0)
          .html("");
      
     d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .style("opacity", 1)
        .style("stroke-width", 2);
      removeTooltip("tooltip2");
      
  }
  
    jobData.forEach((value,key)=>{
    svg.append("pattern")
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", 10)
	 .attr("height", 10)
     .attr("id", function (d) {return "bg" +key.split(' ').join('-')})
     .append("image")
       .attr("x", 0)
       .attr("y", 0)
   			.attr("width", function (d) { return 2 * determineJobSize(value)})
			.attr("height", function (d) { return 2 * determineJobSize(value)})
   .attr("xlink:href", findProfessionPicture(key,value));
        
    
});
     
 for(var i =0; i <personalData.length; i++){
      if(personalData[i].imgUrl.length!=0){
          var link = '../Images/WFPP-Pictures/' + personalData[i].name.split(' ').join('%20') +'.jpg';
      }else{
          var link = '../Images/WFPP-Pictures/Unknown.jpg';
      }
      
    svg.append("pattern")
     .data(personalData)
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", 10)
	 .attr("height", 10)
     .attr("id", personalData[i].id)
     .append("image")
        .attr("x", 0)
        .attr("y", 0)
   	    .attr("width", function (d) { return 60})
        .attr("height", function (d) { return 60})
        .attr("xlink:href", link);  
}
    
    var personalNode = svg.append("g")
        .selectAll("circle")
        .data(personalData)
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
    var clusPos= width/2;
    if(data.length!=0){
        clusPos=width/3;
    }
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(clusPos).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of value is > 0
      // Force that avoids circle overlapping

  //
      simulation
        .nodes(personalData)
        .on("tick", function (d) {
          personalNode
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        });
    
   var showJob = function (d) {
       
       var paras = document.getElementsByClassName('tooltip2');

        while(paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
       Tooltip.style("opacity", 0)
       
       setLevel(3);
       updateState(d.job);
       drawThirdLevel(d.job);
       updateLocator(d.job,getLevel());
    }
  
      // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function (d) { return d.job})
        .attr("r", function (d) { return determineJobSize(d.count)})
        .attr("cx",0)
        .attr("cy", 0)
        .attr("fill", function(d) {
		      return "url(#bg" + d.job.split(' ').join('-')+")";
        })
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseenter", mouseenter)
        .on("mouseleave", mouseleave)
        .on("click", function (d) {showJob(d)});



      // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(2*(width / 3)).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.5).radius(function (d) { return determineJobSize(d.count)}).iterations(1))
      .force('y', d3.forceY().y(height/2).strength(0.012));

  //
      simulation
        .nodes(data)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
        });
    setLevel(2);
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
                        
                    }
                }else{
                    rand--;
                }
            }
        }
    }
    
    if(count>50){
        return '../Images/WFPP-Pictures-Fullsize/Unknown.webp';;
    }else{
        return '../Images/WFPP-Pictures/Unknown.jpg'; 
    } 
}



function determineJobSize(count){
    //return Math.max(30,count);
    if(count<10){
        return 60;
    }else{
        if(count<20 && count >=10){
            return 70;
        }else{
            if(count<50 && count >20){
                return 80;
            }else{
                return 90;
            }
        }
    }
    
}


function createLines(job,data){
    var simJobs = new Set();
    simJobs.add(job)
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.includes(job)){
                for(var k =0; k< wfpp.entries[i].worked_as.length; k++){
                    var entry=wfpp.entries[i].worked_as[k];
                    if(entry.includes(">")){
                        entry= entry.substr(entry.indexOf(">")+1);        
                    }
                    simJobs.add(entry);
                }
                
            }
        }
    }
    var arr = Array.from(simJobs);
    d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .style("opacity", function(){if(arr.includes(d3.select(this).attr('id'))){
        return 1;}else{return 0.3;}})
        .style("stroke-width", function(){if(arr.includes(d3.select(this).attr('id'))){
        return "4px";}else{return 2;}})
    
    simJobs.delete(job);
    var arr = Array.from(simJobs);
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


export {drawSecondLevel}