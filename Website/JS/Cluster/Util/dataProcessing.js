import{getStates} from '../Handlers/stateHandler.js';
import{getLevels} from '../Handlers/levelHandler.js';

     
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

function getTopLevelData(){
    
    var levels = getLevels();
    var topLevel = levels[0];
    
    var jobData= new Map();
    
    for(var i = 0; i <wfpp.entries.length; i++){
        var personsJobs = new Set();
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.includes(">")){
                entry=entry.substr(0,entry.indexOf(">"));
            }else{
                if(!topLevel.has(entry)){
                    entry="Other";
                }
            }
            personsJobs.add(entry);
        }
            personsJobs.forEach((entry)=>{
                if(jobData.has(entry)){
                    var value = jobData.get(entry)+1;
                    jobData.set(entry,value);
                }else{
                    jobData.set(entry,1);
                }  
            });
    }
    
    var data = "job,count\r\n";

    jobData.forEach((value,key)=>{ 
          data+= key + "," + value + "\r\n"
        });
    return d3.csvParse(data); 
}

function getFirstLevelData(profession){
    var levels = getLevels();
    var topLevel = levels[0];
    
    var jobData= new Map();
    
    for(var i = 0; i <wfpp.entries.length; i++){
        var personsJobs = new Set();
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(entry.includes(">") && entry.substr(0,entry.indexOf(">"))==profession){
                entry=entry.substr(entry.indexOf(">")+1);
                if(entry.includes(">")){
                    entry=entry.substr(0,entry.indexOf(">"));
                }
                personsJobs.add(entry);
            }else{
                if(profession=="Other" && !topLevel.has(entry) && !entry.includes(">")){
                    personsJobs.add(entry);
                }
            }  
        }
            personsJobs.forEach((entry)=>{
                if(jobData.has(entry)){
                    var value = jobData.get(entry)+1;
                    jobData.set(entry,value);
                }else{
                    jobData.set(entry,1);
                }  
            });
    }
    var data =sortJobData(jobData);
    return d3.csvParse(data);
}

function getSecondLevelData(profession){
    var levels = getLevels();
    var jobData= new Map();
    for(var i = 0; i <wfpp.entries.length; i++){
         var personsJobs = new Set();
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            var link =  wfpp.entries[i].link;
            var img_url = wfpp.entries[i].image_url;
            var id = wfpp.entries[i].id;
            var name = wfpp.entries[i].name;
            if(entry.includes(">")){
                entry=entry.substr(entry.indexOf(">")+1);
                if(entry.includes(">")){
                    var rest = entry.substr(entry.indexOf(">")+1);
                    entry=entry.substr(0,entry.indexOf(">"));
                    if(entry==profession){
                        if(rest.includes(">")){
                            rest=rest.substr(0,rest.indexOf(">"));
                        }
                        if(rest.length>0){
                            personsJobs.add(rest);
                        }
                    }
                }
            }
        }
        personsJobs.forEach((entry)=>{
                if(jobData.has(entry)){
                    var value = jobData.get(entry)+1;
                    jobData.set(entry,value);
                }else{
                    jobData.set(entry,1);
                }  
            });
    }
    
    var data =sortJobData(jobData);
    return d3.csvParse(data);
}

function getThirdLevelData(profession){
    var levels = getLevels();
    
    //COLLECT PEOPLE
    var jobData= new Map();
    for(var i = 0; i <wfpp.entries.length; i++){
         var personsJobs = new Set();
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            var link =  wfpp.entries[i].link;
            var img_url = wfpp.entries[i].image_url;
            var id = wfpp.entries[i].id;
            var name = wfpp.entries[i].name;
            if(entry.includes(profession)){
                var split = entry.split(">");
                entry= split[2];
                if(split.length>3){
                    personsJobs.add(split[3]);
                }
            }
        }
        personsJobs.forEach((entry)=>{
                if(jobData.has(entry)){
                    var value = jobData.get(entry)+1;
                    jobData.set(entry,value);
                }else{
                    jobData.set(entry,1);
                }  
            });
    }
    var data =sortJobData(jobData);
    return d3.csvParse(data);
}


function getProfessionData(profession){
    var data = "id,name,link,imgUrl,real,job,number\r\n";
    var levels = getLevels();
    var topLevel = levels[0];
    for(var i = 0; i <wfpp.entries.length; i++){
        var hadProfession = false;
        var position=-1;
        for(var j =0; j< wfpp.entries[i].worked_as.length; j++){
            var entry=wfpp.entries[i].worked_as[j];
            if(profession=="Other" && !topLevel.has(entry) && !entry.includes(">")){
                    hadProfession=true;
                    position=j;
                }else{
                if(entry.includes(profession)){
                    hadProfession=true;
                    position=j;
                }
            }
        }
        if(hadProfession){
            var entry=wfpp.entries[i].worked_as[position];
            entry= entry.substr(entry.indexOf(">")+1);
            var link =  wfpp.entries[i].link;
            var img_url = wfpp.entries[i].image_url;
            var id = wfpp.entries[i].id;
            var name = wfpp.entries[i].name;
            data+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n";
        }
    }
    return d3.csvParse(data);
}


function sortJobData(jobData){
    var tempArray=[];
        jobData.forEach((value,key)=>{ 
          tempArray.push([key , value]);
        });
    var sortedPosition=[];
    
    for(var i =0; i<tempArray.length;i++){
        var max= tempArray[i];
        var maxPos=i;
        for(var j =i; j <tempArray.length;j++){
            if(tempArray[j][1]>max[1]){
                max = tempArray[j];
                maxPos = j;
            }
        }
        var temp = tempArray[i];
        tempArray[i]=tempArray[maxPos];
        tempArray[maxPos]=temp;
        sortedPosition.push(max);
    }
    var data = "job,count\r\n";
    for(var i =0; i<sortedPosition.length;i++){
        data+= sortedPosition[i][0] + "," + sortedPosition[i][1] + "\r\n"
    }
    return data;
}

export {getAllData,getTopLevelData,getFirstLevelData,getSecondLevelData,getThirdLevelData,getProfessionData}