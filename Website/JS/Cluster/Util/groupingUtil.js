function findNewIndex(ID, newdata){
    for(var i = 0; i <newdata.length;i++){
        if(newdata[i].id==ID){
            return i;
        }
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

export {determineCx,determineCy,findNewIndex}