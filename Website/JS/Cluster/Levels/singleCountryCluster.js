import {showCountries} from './CountryCluster.js';
import{speedUpAnimation,createTooltip} from '../Util/tooltips.js';
import{determineCxMobile,determineCyMobile,clearPrevDataviz} from '../Util/bubbleUtil.js';
import{goBackState} from '../Handlers/stateHandler.js';
import{addBackButton} from '../Handlers/levelHandler.js';
import{mousemovePersonal,mouseoverPersonal,mouseleavePersonal,mouseClickPersonal,showMobileTooltipPanel} from '../Handlers/mouseHandler.js';
import{switchToCountries} from '../Handlers/connectivityHandler.js';
function showCountryD3(country,timespan){
    clearPrevDataviz();
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
    
    addBackButton();
    
    function goBack(){
        document.getElementById("back").remove();
        switchToCountries(); 
    }
    
    document.getElementById("back").addEventListener("click", goBack)
      
  var radiusofGroup=determineCountryGroupSize(data);
  var imageSize ="Medium";
    if(radiusofGroup<=40){
        imageSize="Small";
    }
 
 for(var i =0; i <data.length; i++){
      if(data[i].imgUrl.length!=0){
          var link = '../Images/WFPP-Pictures-' + imageSize + "/" + data[i].name.split(' ').join('%20') +'.jpg';
      }else{
          var link = '../Images/WFPP-Pictures-' + imageSize +'/Unknown.jpg';
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
  
      if(mobileMode){
          for(var i= 0; i <data.length; i++){
            svg.append("g")
                .data(data)
                .append("circle")
                .attr("class", "node")
                .attr("r", radiusofGroup)
                .attr("cx",function (d){return determineCxMobile(i)})
                .attr("cy",function (d){return determineCyMobile(i)})
                .attr("fill", function(d) {
                      return "url(#"+data[i].id +")";
                })
                .attr("stroke", "black")
                .style("stroke-width", 3)
                .on("click", function(d){showMobileTooltipPanel(d)});
          }
      }else{
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
                .style("stroke-width", 3)
                .on("mouseover", function (d) {mouseoverPersonal(Tooltip);}) 
                .on("mousemove", function (d) {mousemovePersonal(Tooltip,d, this)})
                .on("mouseleave", function (d) {mouseleavePersonal(Tooltip,data)})
                .on("click", function (d) {mouseClickPersonal(Tooltip,data)});
        }


  if(!mobileMode){
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
  }
    
    
}
function determineCountryGroupSize(data){
        if(mobileMode){
            var currentWidth = document.getElementById("my_dataviz").clientWidth;
            return currentWidth/8-10;
        }
        if(data.length>=40){
            return 30;
        }
        if(data.length>10 && data.length<40){
            return 60;
        }
        if(data.length<=10){
            return 80;
        }
    }
export {showCountryD3}