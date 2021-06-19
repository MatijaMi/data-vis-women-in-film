function determineJobSize(count,data,level){
    var width = document.getElementById("my_dataviz").clientWidth;
    var height = document.getElementById("my_dataviz").clientHeight;
    if(count<10){
        return width/25;
    }else{
        if(count<20 && count >=10){
            return width/23;
        }else{
            if(count<50 && count >20){
                return width/22;
            }else{
               return width/18;
            }
        }
    }
}

function determinePersonSize(data){
    if(data.length>140){
        return 35;
    }else{
        if(data.length>100){
           return 40;
        }else{
            if(data.length>50){
                return 50;
            }else{
                if(data.length>20){
                    return 60;
                }else{
                    return 90;
                }
            }
        }
    }
}


function createLines(job,data){
    d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .style("opacity", function(d){if(d.job.includes(job)){return 1;}else{return 0.3;}})
        .style("stroke-width", function(d){if(d.job.includes(job)){return "4px";}else{return "2px";}})
}

function clearPrevDataviz(){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
}

function addPatterns(data,svg){
    
    for(var i = 0; i <wfpp.entries.length; i++){
        if(wfpp.entries[i].image_url.length!=0){
          var link = '../Images/WFPP-Pictures-Squares/' + wfpp.entries[i].name.split(' ').join('%20') +'.jpg';
      }else{
          var link = '../Images/WFPP-Pictures-Squares/Unknown.jpg';
      }
         svg.append("pattern")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
	        .attr("height", 10)
            .attr("id", function (d) {return "bg" + wfpp.entries[i].id})
            .append("image")
            .attr("x", 0)
            .attr("y", 0)
   			.attr("width", "210px")
			.attr("height", "210px")
            .attr("xlink:href", link);
     }
}

function findProfessionPicture(job,count){
    var hasPic=[];
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(wfpp.entries[i].image_url.length!=0){
                if(job!="Other"){
                    if(entry.includes(job) && wfpp.entries[i].image_url.length!=0){
                        hasPic.push(wfpp.entries[i].id);
                    }
                }else{
                    if(!entry.includes(">")){
                        hasPic.push(wfpp.entries[i].id);
                    }
                }
            }
        }
    }
    var rand = hasPic.length;
    if(rand>1){
        rand =Math.floor((Math.random() * hasPic.length));
         return hasPic[rand];
    }else{
        if(rand==1){
            return hasPic[0];
        }else{
            return "1704";
        }
    } 
} 

function addPersonPatterns(personalData,svg){
    for(var i =0; i <personalData.length; i++){
      if(personalData[i].imgUrl.length!=0){
          var link = '../Images/WFPP-Pictures-Squares/' + personalData[i].name.split(' ').join('%20') +'.jpg';
      }else{
          var link = '../Images/WFPP-Pictures-Squares/Unknown.jpg';
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
   	    .attr("width", function (d) { return 180})
        .attr("height", function (d) { return 180})
        .attr("xlink:href", link);  
    }
}


function determineSubgroupY(job,count,data){
    var height= document.getElementById("subGroupPanelSVG").clientHeight;
    var xOffset=determineJobSize(data[0].count,data)+20;
    for(var i =0; i<data.length;i++){
        if(data[i].job==job || job==data[0].job){
            break;
        }
        xOffset +=determineJobSize(data[i].count,data)*2+20;
    }
    return xOffset;
}


export{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,addPatterns,addPersonPatterns,determinePersonSize,determineSubgroupY}