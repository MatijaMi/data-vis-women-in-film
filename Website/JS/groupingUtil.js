var states = [];
import{showAll} from './allPioneers.js';
import{groupByCountry} from './groupByCountries.js';
import{groupByProfession} from './groupByProfession.js';

function updateState(newState){
    if(newState!=states[states.length-1]){
        states.push(newState);
    }
    if(states.length>=4){
        if(states[states.length-1]==states[states.length-3] && states[states.length-2]==states[states.length-4]){
            states.splice(states.length-1,1)
            states.splice(states.length-1,1)
        }    
    }
}

function getStates(){
    return states;
}

function determineColor(id, newData, entries, mode){
    
    for(var i = 0; i <newData.length;i++){
        if(newData[i].id==id){
            if(mode=="country"){
                var entry = newData[i].worked_in[0];
            }else{
                var entry = newData[i].worked_as[0];
            }
        }
    }
    var index = -1;
    for(var i =0; i <entries.length; i++){
        if(entries[i]==entry){
            index = i;
        }
    }
    var mul =0;
    if(mode=="country"){
        mul = 7;
    }else{
        mul = 3;
    }
    
    if(index>0){
        var b = Number(255 - index*mul).toString(16);
        var r = Number(1+index*mul).toString(16);
        if(r.length == 1){
            r= "0"+r;
        }
        return "#" + r +"00" + b;
    }
    
}

function findNewIndex(ID, newdata){
    for(var i = 0; i <newdata.length;i++){
        if(newdata[i].id==ID){
            return i;
        }
    }
}


function handleResize(){
    switch (states[states.length-1]) {
        case 'All':
            showAll();
            break;
        case 'Countries':
            groupByCountry("resize");
            break;
        case 'Professions':
            groupByProfession("resize");
            break;
        default: showAll();
    }
}


function determineCx(index, width){
    var count = Math.floor(width/70);
    var pad = (width- count*70-40)/2;
    return Math.floor(index%(Math.floor(width/70)))*70+40+pad;
}

function determineCy(index, width){
    return Math.floor(index/(Math.floor(width/70)))*70+80;
}

function addGroupPolygons(grouping,mode){
    d3.selectAll("polyline").style("display", "none");
    var data = "groupName,amount,index,indexOfFirst\r\n";
    var indexOfFirst=0;
    for(var i =0; i < grouping.length;i++){
        var amount = 0;
        for(var j =0; j < wfpp.entries.length; j++){
            if(mode=="countries"){
                if(wfpp.entries[j].worked_in[0]==grouping[i]){
                    amount++;
                }
            }else{
                if(wfpp.entries[j].worked_as[0]==grouping[i]){
                    amount++;
                }
            }
        }
        data+= grouping[i] + "," + amount +"," + i +"," +indexOfFirst +"\r\n";
        indexOfFirst+=amount;
    }
    
    data = d3.csvParse(data);
    var svg =d3.select("svg");
    svg.selectAll("g")
        .data(data)
        .enter()
        .append("polyline")
        .attr("points", function(d){return determinePolylineCoords(data,d.index)})
        .style("stroke", "purple")
        .style("fill","block")
        .style("fill-opacity", 0.2)
        .style("stroke-width", 3); 
}


function determinePolylineCoords(data,index){
    var width = window.innerWidth;
    var firstIndex =0;
    var amount =data[index].amount;
    for(var i =0; i <data.length; i++){
        if(data[i].index==index){
            firstIndex = data[i].indexOfFirst;
        }
    }
    var r =35;
    var cx = determineCx(firstIndex,width);
    var cy = determineCy(firstIndex,width);
    if(amount==1){
        return (cx-r) + "," + (cy-r) + " " + (cx+r) + "," + (cy-r) + " " + (cx+r) + "," + (cy+r)  + " " + (cx-r)  +"," + (cy+r) + " " + (cx-r) + "," + (cy-r);
    }else{
        if(fitsInOneLIne(firstIndex,amount,width)){
            return (cx-r) + "," + (cy-r) + " " + (cx-r+2*r*amount) + "," + (cy-r) + " " + (cx-r+2*r*amount) + "," + (cy+r)  + " " + (cx-r)  +"," + (cy+r) + " " + (cx-r) + "," + (cy-r);
        }else{
            if(overlaps(firstIndex,amount,width)){
                return (cx-r) + "," + (cy-r) + " " + (cx-r)  +"," + (cy+r) + " " + (cx+r) + "," + (cy+r);
            }else{
                return (cx-r) + "," + (cy-r) + " " + (cx-r)  +"," + (cy+r) + " " + (cx+r) + "," + (cy+r);
            }
        }
        
    }
}
    

function fitsInOneLIne(firstElem, amount, width){
    var maxAmount = Math.floor(width/70);
    var firstPos = Math.floor(firstElem % maxAmount);
    amount= parseInt(amount);
    return (firstPos+amount)<=maxAmount;    
}

function overlaps(firstElem, amount, width){
    var maxAmount = Math.floor(width/70);
    var firstPos = Math.floor(firstElem % maxAmount);
    amount= parseInt(amount);
    return (amount-(maxAmount-firstPos)>firstPos);
}










































export {determineColor,determineCx,determineCy,handleResize, findNewIndex, updateState, getStates,addGroupPolygons}