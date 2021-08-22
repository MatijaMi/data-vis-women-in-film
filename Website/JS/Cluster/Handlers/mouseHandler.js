import{removeTooltip} from '../Util/tooltips.js'

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

function mouseoverPersonal(Tooltip){
    Tooltip
          .style("opacity", 1)
          .style("width","auto")
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
        imgSrc='<img src=../Images/WFPP-Pictures-Squares/Unknown.jpg width=75%>';
    }else{
        imgSrc='<img src=../Images/WFPP-Pictures-Squares/'+ d.name.split(' ').join('%20') +'.jpg width=200px>';     
    }
    
    Tooltip
          .html('<u><b>' + d.name + '</b></u><br>'+ imgSrc + "<br>" + '<p>' + shortBio +'</p>' + '<button class="fullArticleButton"> Read Full Article</button>')
          .style("width", "300px")
          .style("left", (d3.mouse(env)[0] + 20) + "px")
          .style("top", (d3.mouse(env)[1]) + "px")
}
function mouseleavePersonal(Tooltip){
   Tooltip
          .style("opacity", 0)
          .style("width",0)   
          .style("border",0)
          .style("padding", 0)
          .html("");
      }
export {mouseoverJob,mousemoveJob,mouseleaveJob,mouseoverPersonal,mousemovePersonal,mouseleavePersonal}