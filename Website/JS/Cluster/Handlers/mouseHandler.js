import{removeTooltip} from '../Util/tooltips.js'

function mouseoverJob(Tooltip){
        Tooltip
          .style("opacity", 1)
          .style("width","auto")
          .style("border","solid")
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
          .style("border","solid")
          .style("padding", "5px")
}

function mousemovePersonal(Tooltip,d,env){
    var x  =d3.mouse(env)[0];
       var y = d3.mouse(env)[1];
      if(d.real="real"){
          if(d.imgUrl.length<10){
              Tooltip
          .html('<u><b>' + d.name + '</b></u>' + "<br>" +
                '<img src=../Images/WFPP-Pictures-Squares/Unknown.jpg width=200px>'+
               'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.<br>'+
               '<a href=' + d.link + '> Read More </a>')
          .style("width", "240px")
          .style("left", (d3.mouse(env)[0] + 20) + "px")
          .style("top", (d3.mouse(env)[1]) + "px")
          }else{
           Tooltip
          .html('<u><b>' + d.name + '</b></u>' + "<br>" +
                '<img src=../Images/WFPP-Pictures-Squares/'+ d.name.split(' ').join('%20') +'.jpg width=200px>'+
               '<button> Other Professions </button>')
          .style("width", "240px")
          .style("left", (d3.mouse(env)[0] + 20) + "px")
          .style("top", (d3.mouse(env)[1]) + "px")
            }
      }else{
           Tooltip
          .html('<u>' + d.name + '</u>' + "<br>" + d.name)
          .style("left", (x + 20) + "px")
          .style("top", y + "px")  
      }
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