import{getStates} from './groupingUtil.js';


function getPreviousData(){
    var states = getStates();
    var oldState = states[states.length-1];
    console.log(states)
    console.log(oldState)
    switch (oldState){
        case 'All':
            var data = getAllData();
            break;
        case 'Countries':
            var data = getCountryData();
            break;
        case 'Professions':
            var data = getProfessionData();
            break;
    }
    return data;
}
        
function getAllData(){
    var data = "id,name,link,imgUrl,workedIn,real,number\r\n";
    for(var i = 0; i <wfpp.entries.length; i++){
        var id = wfpp.entries[i].id;
        var name = wfpp.entries[i].name;
        var link =  wfpp.entries[i].link;
        var workedIn =  wfpp.entries[i].worked_in[0];
        var img_url = wfpp.entries[i].image_url;
        data+= id + "," + name + "," +link + "," + img_url + "," + workedIn + "," + "real," + i +"\r\n" 
    }
    data = d3.csvParse(data);
    return [data];
}
    
function getCountryData(){
    var data = "id,name,link,imgUrl,workedIn,real,number\r\n";
    var countries =[];
    
    for(var i = 0; i <wfpp.entries.length; i++){
        if(!countries.includes(wfpp.entries[i].worked_in[0])){
            countries.push(wfpp.entries[i].worked_in[0])
        }
    }
    countries.sort();
    
    var newData = [];
    for(var i =0; i <countries.length;i++){
        for(var j =0; j <wfpp.entries.length;j++){
            if(wfpp.entries[j].worked_in[0]== countries[i]){
                newData.push(wfpp.entries[j]);
            }
        }
    }
    return [newData,countries]; 
}
    
function getProfessionData(){
    var data = "id,name,link,imgUrl,workedAs,real,number\r\n";
    var professions =[];
    
    for(var i = 0; i <wfpp.entries.length; i++){
        if(!professions.includes(wfpp.entries[i].worked_as[0])){
            professions.push(wfpp.entries[i].worked_as[0])
        }
    }
    professions.sort();
    var newData = [];
    for(var i =0; i <professions.length;i++){
        for(var j =0; j <wfpp.entries.length;j++){
            if(wfpp.entries[j].worked_as[0]== professions[i]){
                newData.push(wfpp.entries[j]);
            }
        }
    }
    return [newData,professions];
}

export{getPreviousData,getAllData,getCountryData,getProfessionData}