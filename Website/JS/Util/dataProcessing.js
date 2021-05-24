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
                if(topLevel.has(entry) && entry==profession){
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
    
    var data = "job,count\r\n";
    jobData.forEach((value,key)=>{ 
          data+= key + "," + value + "\r\n"
        });
    
    return d3.csvParse(data);
}

function getSecondLevelData(profession){
    var levels = getLevels();
    var jobData= new Map();
    var persData = "id,name,link,imgUrl,real,job,number\r\n";
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
                       persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n";
                        if(rest.includes(">")){
                            rest=rest.substr(0,rest.indexOf(">"));
                        }
                        personsJobs.add(rest);
                    }
                }else{
                   if(entry==profession){
                      persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n"; 
                   } 
                }
            }else{
                if(levels[0].has(entry) && entry==profession){
                    persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n"; 
                }
                if(!levels[0].has(entry)){
                    if(entry==profession){
                        persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n";
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
    
    
    var personalData = d3.csvParse(persData);
    var data = "job,count\r\n";
    jobData.forEach((value,key)=>{ 
          data+= key + "," + value + "\r\n"
        });
    return [personalData,d3.csvParse(data)];
}

function getThirdLevelData(profession){
    var levels = getLevels();
    
    //COLLECT PEOPLE
    var jobData= new Map();
    var persData = "id,name,link,imgUrl,real,job,number\r\n";
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
                 persData+= id + "," + name + "," +link + "," + img_url + "," + "real," + entry + "," + i +"\r\n";
                 
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
    var personalData = d3.csvParse(persData);
    var data = "job,count\r\n";
    jobData.forEach((value,key)=>{ 
          data+= key + "," + value + "\r\n"
        });
    
    data = d3.csvParse(data);
    return [personalData,data];
}

export {getAllData,getTopLevelData,getFirstLevelData,getSecondLevelData,getThirdLevelData}