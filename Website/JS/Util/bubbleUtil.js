function determineJobSize(count,data,level){
    //return Math.max(30,count);
    if(level==0){
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
    
    if(level==1){
        if(data.length<20){
            return 90;
        }else{
            return 45;
        }
    
    }
    if(level==2){
        if(data.length<20){
            return 60;
        }else{
            return 30;
        }
    }
    
    if(level==3){
        if(data.length<20){
            return 60;
        }else{
            return 45;
        }
        
    }
    
}


function createLines(job,data){
    var similarJobs = new Set();
    similarJobs.add(job)
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.includes(job)){
                for(var k =0; k< wfpp.entries[i].worked_as.length; k++){
                    var entry=wfpp.entries[i].worked_as[k];
                    if(entry.includes(">")){
                        entry= entry.substr(entry.indexOf(">")+1);        
                    }
                    similarJobs.add(entry);
                }
                
            }
        }
    }
    var arr = Array.from(similarJobs);
    d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .style("opacity", function(){if(arr.includes(d3.select(this).attr('id'))){
        return 1;}else{return 0.3;}})
        .style("stroke-width", function(){if(arr.includes(d3.select(this).attr('id'))){
        return "4px";}else{return 2;}})
    
    similarJobs.delete(job);
    var arr = Array.from(similarJobs);
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

function clearPrevDataviz(){
    if(document.getElementById("my_dataviz").firstChild!=null){
        document.getElementById("my_dataviz").removeChild(document.getElementById("my_dataviz").firstChild);
    }
}

function addPatterns(data,svg){
    
    for(var i = 0; i <wfpp.entries.length; i++){
        if(wfpp.entries[i].image_url.length!=0){
          var link = '../Images/WFPP-Pictures/' + wfpp.entries[i].name.split(' ').join('%20') +'.jpg';
      }else{
          var link = '../Images/WFPP-Pictures/Unknown.jpg';
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
   			.attr("width", "180px")
			.attr("height", "180px")
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
   	    .attr("width", function (d) { return 180})
        .attr("height", function (d) { return 180})
        .attr("xlink:href", link);  
    }
}

function createElipse(data,svg){
    var centerX = window.innerWidth/2;
    var centerY = (window.innerHeight - 50)/2;
    
    var maxX=0;
    var maxXR;
    var maxY=0;
    var maxYR=0;
    
    for(var i =0; i <data.length; i++){
        var x = document.getElementById(data[i].job).cx.baseVal.value;
        var y = document.getElementById(data[i].job).cy.baseVal.value;
        var r = document.getElementById(data[i].job).r.baseVal.value;
       if(Math.abs(centerX-x)>maxX){
           maxX=Math.abs(centerX-x);
           maxXR=r;
       }
        if(Math.abs(centerY-y)>maxY){
            maxY=Math.abs(centerY-y);
            maxYR=r;
        }
    }
    svg.append("ellipse")
        .attr("cx",centerX)
        .attr("cy", centerY)
        .attr("rx", maxX+r*(Math.sign(centerX-maxX))+10)
        .attr("ry", maxY+r*(Math.sign(centerY-maxY))+30)
        .style("stroke", "black")
        .style("stroke-width","5px")
        .style("fill","none");
}

export{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,addPatterns,addPersonPatterns,createElipse}