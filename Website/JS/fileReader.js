class Pioneer {
    constructor(id, name, aka, link, image_url, worked_as, worked_in, birth_date, death_date) {
        this.id = id;
        this.name = name;
        this.aka = aka;
        this.link = link;
        this.image_url = image_url;
        this.worked_as = worked_as;
        this.worked_in = worked_in;
        this.birth_date = birth_date;
        this.death_date = death_date;
    }

    toString = function pioneerToString() {
        return this.name;
    }

}

function readCSVFile(path) {

    //Creat XML Request
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.send(null);

    //Busy loop
    while (!rawFile.DONE) { }

    //Return filecontent
    return rawFile.responseText;
}


function getAllPioneers() {

    //Result
    var pioneers = [];

    //Read File
    fileContent = readCSVFile("Data/wfpp_data.csv");

    //Rows
    rows = fileContent.split('\r\n');

    //Foreach Row
    for (var i = 1; i < rows.length; i++) {

        //Row fields
        var data = rows[i].split(',');

        //Merge values
        if (data.length > 9) {

            //Find '"' and assume ',' later
            for (var j = 0; j < data.length; j++) {
                if (data[j].startsWith("\"")) {

                    if (data[j].endsWith("\"")) {
                        data[j] = data[j].replace("\"", "").trim()
                    }
                    else {
                        //Find first name
                        var name = data[j].replace("\"", "").trim();

                        //Add all names
                        while (!data[j + 1].endsWith("\"")) {
                            name += "|" + data[j + 1];
                            data.splice(j + 1, 1);
                        }

                        //Found end
                        name += "|" + data[j + 1].replace("\"", "").trim();
                        data.splice(j + 1, 1);

                        //Replace
                        data[j] = name;
                    }

                }
            }

        }

        //Extract values
        var id = data[0];
        var name = data[1].trim();
        var aka = data[2].split('|');
        var link = data[3].trim();
        var image_url = data[4].trim();
        var worked_as = data[5].trim().split('|');
        var worked_in = data[6].trim().split('|');
        var birth_date = new Date(data[7].replace("|", ","));
        var death_date = new Date(data[8].replace("|", ","));

        //Create pioneer
        pioneers[i - 1] = new Pioneer(id, name, aka, link, image_url, worked_as, worked_in, birth_date, death_date);
    }

    //Return
    return pioneers;
}

