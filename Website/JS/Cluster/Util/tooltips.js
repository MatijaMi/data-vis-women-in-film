function removeTooltip(name){
    var paras = document.getElementsByClassName(name);

      while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
        }
}

function createTooltip(){
   var Tooltip= d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("z-index", "5")
        .style("position", "absolute")
   return Tooltip;
}


function createTextOverlay(data,mode,container){
    for(var i =0; i <data.length; i++){
        if(mode=="Professions"){
            var x = document.getElementById(data[i].job).cx.baseVal.value;
            var y = document.getElementById(data[i].job).cy.baseVal.value;
            var r = document.getElementById(data[i].job).r.baseVal.value;
            var text = data[i].job.split(" ");
        }else{
            var x = document.getElementById(data[i].country).cx.baseVal.value;
            var y = document.getElementById(data[i].country).cy.baseVal.value;
            var r = document.getElementById(data[i].country).r.baseVal.value;
            var text = data[i].country.split(" ");
        }
        var inHtml ="";
        for(var j=0; j<text.length;j++){
            inHtml=inHtml +text[j].charAt(0).toUpperCase()+ text[j].slice(1) +"<br>";   
        }
        var xShift=0;
        var yShift=0;
        var calculatedFont =r/2+"px";
        var lineHeight = r/2 +4 + "px";
        if(text.length==1){
            yShift=0;
            if(inHtml.length>9){
                calculatedFont="auto";
                lineHeight = "auto";
            }
        }else{
            if(text.length==2){
                calculatedFont=r/3+"px";
                lineHeight = r/3 +4 + "px";
            }else{
                calculatedFont=r/4+"px";
                lineHeight = r/4 +4 + "px";
            }
        }
        var Tooltip = d3.select("#"+container)
                .append("div")
                .html(inHtml)//+ "\n" +data[i].count
                .style("opacity", 1)
                .attr("class", "textOverlay")
                .style("line-height", lineHeight)
                .style("font-size",calculatedFont)
                .style("z-index", 5)
                .style("left", x-r +"px")
                .style("top", y+yShift + "px")   
                .style("width", 2*r +"px") 
    }
}

function speedUpAnimation(simulation,rate){
     var ticksPerRender = rate;

    requestAnimationFrame(function render() {

  for (var i = 0; i < ticksPerRender; i++) {
    simulation.tick();
  }

  // UPDATE NODE AND LINK POSITIONS HERE

  if (simulation.alpha() > 0) {
    requestAnimationFrame(render);
  }
    });
}


export {removeTooltip,createTooltip,createTextOverlay,speedUpAnimation}