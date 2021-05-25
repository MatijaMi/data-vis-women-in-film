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
        .style("position", "absolute")
   return Tooltip;
}


function createTextOverlay(data){
    
    for(var i =0; i <data.length; i++){
        var x = document.getElementById(data[i].job).cx.baseVal.value;
        var y = document.getElementById(data[i].job).cy.baseVal.value;
        var r = document.getElementById(data[i].job).r.baseVal.value;
        var text = data[i].job.split(" ");
        var inHtml ="";
        for(var j=0; j<text.length;j++){
            inHtml=inHtml +text[j].charAt(0).toUpperCase()+ text[j].slice(1) +"<br>";   
        }
        var xShift;
        var yShift;
        var calculatedFont;
        
        var Tooltip = d3.select("body")
                .append("div")
                .html('<b>' +inHtml + '</b>')
                .style("opacity", 1)
                .attr("class", "textOverlay")
                .style("background-color", "none")
                .style("border", "none")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "0px")
                .style("margin", "0px")
                .style("text-align", "center")
                .style("font-family", " 'Times New Roman', serif")
                .style("font-size","20px")
                .style("color","#fff")
                .style("text-shadow", "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000")
                .style("position", "absolute")
                .style("left", x-r +"px")
                .style("top", y+r/2+ "px")   
                .style("width", 2*r +"px")   
                .style("animation","fadein 1.5s")   
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