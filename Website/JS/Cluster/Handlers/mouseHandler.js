import{removeTooltip} from '../Util/tooltips.js'
////////////////////////////////////

//Function that control the tooltip for professions
function mouseoverJob(Tooltip){
        Tooltip
          .style("opacity", 1)
          .style("width","auto")
          .style("border","solid black")
          .style("padding", "5px")
}

function mousemoveJob(Tooltip,d,env){
    Tooltip
        .html('<u>' + d.job + '</u>' + "<br>" + d.count)
        .style("left", (d3.mouse(env)[0] + 20) + "px")
        .style("top", (d3.mouse(env)[1]) + "px")
}

function mouseleaveJob(Tooltip,data,env){
     Tooltip
          .style("opacity", 0)
          .style("width",0)
          .style("border",0)
          .style("padding", 0)
          .html("");
      removeTooltip("tooltip2");
}

//Function that control the tooltip for the pioneers themselves
function mouseoverPersonal(Tooltip){
    Tooltip
          .style("opacity", 1)
          .style("border","solid black")
          .style("padding", "10px")
}

function mousemovePersonal(Tooltip,d,env){
    var x  =d3.mouse(env)[0];
    var y = d3.mouse(env)[1];
    var shortBio ="";
    for(var i =0; i <wfppTexts.entries.length ;i++){
        var pioneer = wfppTexts.entries[i];
        if(pioneer.id==d.id){
            shortBio=pioneer.shortBio;
        }
    }

    var imgSrc ="";
    if(d.imgUrl.length<10){
        imgSrc='<img src=Images/WFPP-Pictures-Squares/Unknown.jpg width=75%>';
    }else{
        imgSrc='<img src=Images/WFPP-Pictures-Squares/'+ d.name.split(' ').join('%20') +'.jpg width=200px>';     
    }
    Tooltip
          .html('<a id="closeMainTooltip" href="javascript:void(0)" class="closebtn">&times;</a><u><b>' + d.name + '</b></u><br>'+ imgSrc + "<br>" + '<p>' + shortBio +'</p>' + '<button id="fullArticleButton"> Read Full Article</button>')
          .style("width", "300px")
    
    document.getElementById("fullArticleButton").addEventListener("click", function(){
        window.open(d.link,"_blank");
    })
    
    var mouseX = d3.mouse(env)[0];
    var mouseY = d3.mouse(env)[1];
    var tooltipW = document.getElementById("mainTooltip").clientWidth;
    var tooltipH = document.getElementById("mainTooltip").clientHeight;
        
    var top= mouseY;
    var left = mouseX;
    var windowWidth = document.getElementById("body").clientWidth;
    var windowHeight = document.getElementById("body").clientHeight;
    
    //console.log(mouseX + ";" + mouseY + ";" + tooltipH +";" + tooltipW+ ";");
    if(mouseX+tooltipW+20>windowWidth){
        left=left-tooltipW-30;
    }
    if(mouseY+tooltipH>windowHeight){
        top=windowHeight-tooltipH + document.getElementById("myTopnav").clientHeight;
    }
    
    Tooltip
        .style("left", (left + 20 +"px"))
        .style("top", (top + "px"));
}

function mouseleavePersonal(Tooltip){
   Tooltip
          .style("opacity", 0)
          .style("width",0)   
          .style("border",0)
          .style("padding", 0)
          .html("");
}

function mouseClickPersonal(Tooltip,data){
    d3.selectAll(".node")
        .on("mouseover", "") 
        .on("mousemove", "")
        .on("click", "")
        .on("mouseleave", "")
    
    document.getElementById("closeMainTooltip").addEventListener("click",function(){
        closeMainTooltip(Tooltip,data);
    })
    
}

function closeMainTooltip(Tooltip,data){
    d3.selectAll(".node")
        .on("mouseover", function (d) {mouseoverPersonal(Tooltip);}) 
        .on("mousemove", function (d) {mousemovePersonal(Tooltip,d, this)})
        .on("click", function (d) {window.zoomedIn=true;mouseClickPersonal(Tooltip, data)})
        .on("mouseleave", function (d) {mouseleavePersonal(Tooltip,data)})
    Tooltip
          .style("opacity", 0)
          .style("width",0)   
          .style("border",0)
          .style("padding", 0)
          .html("");
    window.zoomedIn=false;
}

// Function for mobile tooltip, which is a panle instead of a floating div due to mobile design
function showMobileTooltipPanel(d){
    document.getElementById("mobileTooltipPanel")
    var shortBio ="";
    for(var i =0; i <wfppTexts.entries.length ;i++){
        var pioneer = wfppTexts.entries[i];
        if(pioneer.id==d.id){
            shortBio=pioneer.shortBio;
        }
    }

    var imgSrc ="";
    if(d.imgUrl.length<10){
        imgSrc='<img src=Images/WFPP-Pictures-Squares/Unknown.jpg width=75%>';
    }else{
        imgSrc='<img src=Images/WFPP-Pictures-Squares/'+ d.name.split(' ').join('%20') +'.jpg width=200px>';     
    }
    d3.select("#mobileTooltipPanel")
          .html('<a id="closeMobileTooltip" href="javascript:void(0)" class="closebtn">&times;</a><b>' + d.name + '</b><br>'+ imgSrc + "<br>" + '<p>' + shortBio +'</p>' + '<button id="fullArticleButton"> Read Full Article</button>')
          .style("width", "300px")
    
    document.getElementById("fullArticleButton").addEventListener("click", function(){
        window.open(d.link,"_blank");
    })
    
    d3.select("#mobileTooltipPanel").style("width", "auto");
    
    document.getElementById("closeMobileTooltip").addEventListener("click", function(){
         d3.select("#mobileTooltipPanel").style("width", "0px").html("");
    });
}




export {mouseoverJob,mousemoveJob,mouseleaveJob,mouseoverPersonal,mousemovePersonal,mouseleavePersonal,mouseClickPersonal,showMobileTooltipPanel}