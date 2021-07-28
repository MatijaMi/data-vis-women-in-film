function determineJobSize(count){
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
    var validIDs=[];
    for(var i =0; i <wfpp.entries.length;i++){
        var entry =wfpp.entries[i].worked_as;
        for(var j=0; j<entry.length;j++){
            if(entry[j].includes(job)){
                validIDs.push(wfpp.entries[i].id);
            }
        }
    }
    d3.select("#my_dataviz")
        .selectAll("circle")
        .data(data)
        .style("opacity", function(d){if(validIDs.includes(d.id)){return 1;}else{return 0.3;}})
        .style("stroke-width", function(d){if(validIDs.includes(d.id)){return "4px";}else{return "2px";}})
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

function findProfessionPicture(profession,data,svg,mode){
    var hasPic=[];
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(wfpp.entries[i].image_url.length!=0){
                if(profession.job!="Other"){
                    if(entry.includes(profession.job) && wfpp.entries[i].image_url.length!=0){
                        hasPic.push(wfpp.entries[i]);
                    }
                }else{
                    if(!entry.includes(">")){
                        hasPic.push(wfpp.entries[i]);
                    }
                }
            }
        }
    }
    var rand = hasPic.length;
    var patternID= "1704" ;
    var link = '../Images/WFPP-Pictures-Squares/Unknown.jpg';
    if(mode=="top"){
        var r = determineJobSize(profession.count);
    }else{
        if(mode=="sub"){
            var r = determineSubGroupSize(profession.count,data);
        }
    }
    if(rand>1){
        rand =Math.floor((Math.random() * hasPic.length));
        patternID =hasPic[rand].id;
        link = '../Images/WFPP-Pictures-Squares/' + hasPic[rand].name.split(' ').join('%20') +'.jpg';
    }else{
        if(rand==1){
            patternID =hasPic[0].id;
            link = '../Images/WFPP-Pictures-Squares/' + hasPic[0].name.split(' ').join('%20') +'.jpg';
        }
    }
    if(mobileMode){
        var currentWidth = document.getElementById("my_dataviz").clientWidth;
        r=currentWidth/8-10;
    }
    if(mode=="subMobile"){
        r=currentWidth/4-10;
    }
    svg.append("pattern")
            .attr("class", "bubblePattern")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
	        .attr("height", 10)
            .attr("id", function (d) {return "bg" + patternID+"_"+r})
            .append("image")
            .attr("x", 0)
            .attr("y", 0)
   			.attr("width", r*2+"px")
			.attr("height", r*2+"px")
            .attr("xlink:href", link);
    return patternID+"_" +r;
}

function findCountryPicture(country,count,svg){
    var hasPic=[];
    for(var i = 0; i <wfpp.entries.length; i++){
        for(var j =0; j< wfpp.entries[i].worked_in.length; j++){
            var entry=wfpp.entries[i].worked_in[j];
            if(wfpp.entries[i].image_url.length!=0){
                if(entry.includes(country)){
                    hasPic.push(wfpp.entries[i]);
                }    
            }
        }
    }
    var rand = hasPic.length;
    var patternID= "1704" ;
    var link = '../Images/WFPP-Pictures-Squares/Unknown.jpg';
    var r=determineCountrySize(count);
    
    if(rand>1){
        rand =Math.floor((Math.random() * hasPic.length));
        patternID =hasPic[rand].id;
        link = '../Images/WFPP-Pictures-Squares/' + hasPic[rand].name.split(' ').join('%20') +'.jpg';
    }else{
        if(rand==1){
            patternID =hasPic[0].id;
            link = '../Images/WFPP-Pictures-Squares/' + hasPic[0].name.split(' ').join('%20') +'.jpg';
        }
    }
    if(mobileMode){
        var currentWidth = document.getElementById("my_dataviz").clientWidth;
        r=currentWidth/8-10;
    }
    svg.append("pattern")
            .attr("class", "bubblePattern")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
	        .attr("height", 10)
            .attr("id", function (d) {return "bg" + patternID+"_"+r})
            .append("image")
            .attr("x", 0)
            .attr("y", 0)
   			.attr("width", r*2+"px")
			.attr("height", r*2+"px")
            .attr("xlink:href", link);
    
    return patternID+"_"+r;
}

function findPersonPicture(id,data,svg){
    var r= determinePersonSize(data);
    var patternID= id + "_" + r;
    for(var i =0; i <data.length; i++){
        if(id==data[i].id){
          if(data[i].imgUrl.length!=0){
              var link = '../Images/WFPP-Pictures-Squares/' + data[i].name.split(' ').join('%20') +'.jpg';
          }else{
              patternID="1704_" +r;
              var link = '../Images/WFPP-Pictures-Squares/Unknown.jpg';
          }
        }
    }
    if(mobileMode){
        var currentWidth = document.getElementById("my_dataviz").clientWidth;
        r=currentWidth/8-10;
    }
    svg.append("pattern")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
	        .attr("height", 10)
            .attr("id", function (d) {return "bg" + patternID+"_"+r})
            .append("image")
            .attr("x", 0)
            .attr("y", 0)
   			.attr("width", r*2+"px")
			.attr("height", r*2+"px")
            .attr("xlink:href", link);
    return patternID+"_"+r;
}


function determineSubGroupSize(data){
    var height = document.getElementById("subGroupPanelSVG").clientHeight-50;
    var amount = data.length;
    var r =document.getElementById("my_dataviz").clientWidth*0.05;
    
    if(height/(amount*2)<r){
        return height/(amount*2)-(15/amount);
    }
    
    return r-10;
}

function determineSubgroupY(job,count,data){
    var height= document.getElementById("subGroupPanelSVG").clientHeight;
    var rOffset=determineSubGroupSize(data)+10;
    var r = determineSubGroupSize(data);
    for(var i =0; i<data.length;i++){
        if(data[i].job==job || job==data[0].job){
            break;
        }
        rOffset +=r*2+5;
    }
    return rOffset;
}

function determineCountrySize(count){
    var width = document.getElementById("my_dataviz").clientWidth;
    var height = document.getElementById("my_dataviz").clientHeight;
    if(count<10){
        return width/30;
    }else{
        if(count<20 && count >=10){
            return width/20;
        }else{
            if(count<50 && count >20){
                return width/17;
            }else{
                return width/13;
            }
        }
    }
}


function determineCxMobile(ranking,mode){
    var currentWidth = document.getElementById("my_dataviz").clientWidth;
    if(mode!="subMobile"){
        return (currentWidth/8)+ranking%4 * (currentWidth/4)-4;
    }else{
        return (currentWidth/4)+ranking%2 * (currentWidth/2)-4;
    }
    
}

function determineCyMobile(ranking,mode){
    var currentWidth = document.getElementById("my_dataviz").clientWidth;
    if(mode!="subMobile"){
        return 180+ (currentWidth/4)*Math.floor(ranking/4);
    }else{
        return 100+ (currentWidth/2)*Math.floor(ranking/2);
    }
    
    
}

function determineJobSizeMobile(mode){
    var currentWidth = document.getElementById("my_dataviz").clientWidth;
    if(mode!="subMobile"){
        return currentWidth/8-10;
    }else{
        return currentWidth/4-10;
    }
}

export{findProfessionPicture,createLines,determineJobSize,clearPrevDataviz,addPatterns,determinePersonSize,determineSubgroupY,determineSubGroupSize,findPersonPicture,determineCountrySize,findCountryPicture,determineCyMobile,determineCxMobile,determineJobSizeMobile}