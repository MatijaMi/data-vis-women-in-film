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

        //Reduce countries
        var countries_string = data[6].trim()
            .replace("England", "Great Britain")
            .replace("Scotland", "Great Britain")
            .replace("Soviet Union", "Russia")
            .replace("Hong Kong", "China")

        //Extract values
        var id = data[0];
        var name = data[1].trim();
        var aka = data[2].split('|');
        var link = data[3].trim();
        var image_url = data[4].trim();
        var worked_as = data[5].trim().split('|');
        var worked_in = countries_string.split('|').filter((v, i, a) => a.indexOf(v) === i);;
        var birth_date = new Date(data[7].replace("|", ","));
        var death_date = new Date(data[8].replace("|", ","));

        //Create pioneer
        pioneers[i - 1] = new Pioneer(id, name, aka, link, image_url, worked_as, worked_in, birth_date, death_date);
    }

    //Return
    return pioneers;
}

function getAllPioneersLog() {

    //Result
    var pioneers = [];

    //Read File
    fileContent = readCSVFile("Data/wfpp_data.csv");

    //Rows
    rows = fileContent.split('\r\n');

    //Log
    console.log("Start writing Log for " + (rows.length - 1) + " pioneers");
    console.log("")
    var log_birth_date_only_year = 0;
    var log_birth_date_unreadable = 0;
    var log_birth_date_unreadable_instances = [];
    var log_death_date_only_year = 0;
    var log_death_date_unreadable = 0;
    var log_death_date_unreadable_instances = [];

    var log_both_date_only_year = 0;
    var log_both_date_unreadable = 0;

    var log_country_england = 0;
    var log_country_soviet = 0;
    var log_country_hongkong = 0;
    var log_country_scotland = 0;

    var log_no_image = 0;

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

        //Log
        if (data[6].trim().includes("England")) log_country_england++;
        if (data[6].trim().includes("Scotland")) log_country_scotland++;
        if (data[6].trim().includes("Soviet Union")) log_country_soviet++;
        if (data[6].trim().includes("Hong Kong")) log_country_hongkong++;

        //Reduce countries
        var countries_string = data[6].trim()
            .replace("England", "Great Britain")
            .replace("Scotland", "Great Britain")
            .replace("Soviet Union", "Russia")
            .replace("Hong Kong", "China")

        //Extract values
        var id = data[0];
        var name = data[1].trim();
        var aka = data[2].split('|');
        var link = data[3].trim();
        var image_url = data[4].trim();
        var worked_as = data[5].trim().split('|');
        var worked_in = countries_string.split('|').filter((v, i, a) => a.indexOf(v) === i);
        var birth_date = new Date(data[7].replace("|", ","));
        var death_date = new Date(data[8].replace("|", ","));

        //Log - no image
        if (image_url == "") log_no_image++;

        //Log - Birth-date
        if (data[7].replace("|", ",").length == 4) log_birth_date_only_year++;
        if (!birth_date instanceof Date || isNaN(birth_date)) {
            log_birth_date_unreadable_instances.push("\"" + data[7].replaceAll("|", ",") + "\"");
            log_birth_date_unreadable++;
        }

        //Log - Birth-date
        if (data[8].replace("|", ",").length == 4) log_death_date_only_year++;
        if (!death_date instanceof Date || isNaN(death_date)) {
            log_death_date_unreadable_instances.push("\"" + data[8].replaceAll("|", ",") + "\"");
            log_death_date_unreadable++;
        }

        //Log - Both-date
        if (data[7].replace("|", ",").length == 4 && data[8].replace("|", ",").length == 4) log_both_date_only_year++;
        if ((!birth_date instanceof Date || isNaN(birth_date)) && (!death_date instanceof Date || isNaN(death_date))) log_both_date_unreadable++;

        //Create pioneer
        pioneers[i - 1] = new Pioneer(id, name, aka, link, image_url, worked_as, worked_in, birth_date, death_date);
    }

    //Log
    console.log("Birthdate:")
    console.log("Only Year: " + log_birth_date_only_year);
    console.log("Unreadable: " + log_birth_date_unreadable);
    console.log("Unreadable instances: " + log_birth_date_unreadable_instances.filter((v, i, a) => a.indexOf(v) === i));

    console.log("")
    console.log("Deathdate:")
    console.log("Only Year: " + log_death_date_only_year);
    console.log("Unreadable: " + log_death_date_unreadable);
    console.log("Unreadable instances: " + log_death_date_unreadable_instances.filter((v, i, a) => a.indexOf(v) === i));

    console.log("")
    console.log("Both dates:")
    console.log("Only Year: " + log_both_date_only_year);
    console.log("Unreadable: " + log_both_date_unreadable);

    console.log("")
    console.log("Countries:")
    console.log("'England' replaced with 'Great Britain': " + log_country_england);
    console.log("'Scotland' replaced with 'Great Britain': " + log_country_scotland);
    console.log("'Soviet Union' replaced with 'Russia': " + log_country_soviet);
    console.log("'Hong Kong' replaced with 'China': " + log_country_hongkong);

    console.log("")
    console.log("Pioneer is only shown on map and timeline if both dates are known")
    console.log("Displayed on map and timeline: " + pioneers.filter(x => x.birth_date instanceof Date && !isNaN(x.birth_date)).filter(x => x.death_date instanceof Date && !isNaN(x.death_date)).length)

    console.log("")
    console.log("Pioneer has no image: " + log_no_image)

    //Return
    return pioneers;
}