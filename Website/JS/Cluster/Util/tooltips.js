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
        .attr("id", "mainTooltip");
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
        var pureText=""
        for(var j=0; j<text.length;j++){
            inHtml=inHtml +text[j].charAt(0).toUpperCase()+ text[j].slice(1) +"<br>";   
            pureText=pureText +text[j].charAt(0).toUpperCase()+ text[j].slice(1);   
        }
        var xShift=0;
        var yShift=0;
        var calculatedFont =r/2 - 5 +"px";
        var lineHeight = r/2 +4 + "px";
        
        if(text.length==1){
            var pureText=text[0].charAt(0).toUpperCase()+ text[0].slice(1);
                yShift=r/2 +10;
                if(pureText.length>8){
                    inHtml=pureText.substr(0,Math.ceil(pureText.length/2)) +"-<br>" + pureText.substr(Math.ceil(pureText.length/2));
                    yShift=30;
                }
                if(container!="body"){
                    yShift=r/3;
                    if(pureText.length<8){
                        yShift=r/2;
                    }
                } 
        }else{
            if(text.length==2){
                if(container=="body"){
                    calculatedFont=r/2+ -5 +"px";
                    lineHeight = r/2 +8 + "px";
                    yShift=20;
                }else{
                    yShift=r/8;
                    calculatedFont=r/3+"px";
                    lineHeight = r/3 +4 + "px";
                }
            }else{
                if(container=="body"){
                    calculatedFont=r/3+"px";
                    lineHeight = r/3 +4 + "px";
                    yShift=35;
                }else{
                    yShift=-r/4;
                    calculatedFont=r/3+"px";
                    lineHeight = r/3 +4 + "px";
                }
            }
        }
        var Tooltip = d3.select("#"+container)
                .append("div")
                .html(inHtml)//+ "\n" +data[i].count
                .style("opacity", 1)
                .attr("class", "textOverlay")
                .style("line-height", lineHeight)
                .style("font-size",calculatedFont)
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