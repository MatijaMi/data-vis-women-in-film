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

function mouseleaveJob(Tooltip,data){
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

export {mouseoverJob,mousemoveJob,mouseleaveJob}