//Global Variables
var photo_grid = null;

/**
 * Class representing a Country
 */
class Country {

    //Constant data
    country_name;
    country_code;
    country_long;
    country_lat;

    //Calculated data
    country_connected_countries = [];
    country_pioneers = [];
    country_jobs = [];

    constructor(name, code, long, lat) {
        this.country_name = name;
        this.country_code = code;
        this.country_long = long;
        this.country_lat = lat;
    }

    clear() {
        this.country_connected_countries.length = 0
        this.country_pioneers.length = 0
        this.country_jobs.length = 0
    }
}

/**
 * Class representing a pioneer
 */
class Pioneer {

    pioneer_name;
    pioneer_image;
    pioneer_link;
    pioneer_worked_in = [];
    pioneer_worked_as = [];

    constructor(name, image, link, worked_in, worked_as) {
        this.pioneer_name = name;
        this.pioneer_image = image;
        this.pioneer_link = link;
        this.pioneer_worked_in = worked_in;
        this.pioneer_worked_as = worked_as;
    }
}

/**
 * Creating the 32 countries which include data
 */
function createAllCountries() {
    var countries = [];
    countries.push(new Country("Great Britain", "GBR", "955", "360"));
    countries.push(new Country("United States", "USA", "550", "450"));
    countries.push(new Country("Argentina", "ARG", "690", "780"));
    countries.push(new Country("Australia", "AUS", "1600", "750"));
    countries.push(new Country("New Zealand", "NZL", "1685", "835"));
    countries.push(new Country("Austria", "AUT", "1025", "395"));
    countries.push(new Country("China", "CHN", "1400", "450"));
    countries.push(new Country("Germany", "DEU", "1010", "355"));
    countries.push(new Country("Hungary", "HUN", "1045", "395"));
    countries.push(new Country("Brazil", "BRA", "750", "680"));
    countries.push(new Country("Canada", "CAN", "500", "300"));
    countries.push(new Country("Italy", "ITA", "1010", "420"));
    countries.push(new Country("France", "FRA", "970", "400"));
    countries.push(new Country("Chile", "CHL", "645", "845"));
    countries.push(new Country("Japan", "JPN", "1555", "455"));
    countries.push(new Country("Colombia", "COL", "645", "615"));
    countries.push(new Country("Czechoslovakia", "CZE", "1025", "380"));
    countries.push(new Country("Denmark", "DNK", "1000", "330"));
    countries.push(new Country("Norway", "NOR", "990", "290"));
    countries.push(new Country("Sweden", "SWE", "1020", "290"));
    countries.push(new Country("Ireland", "IRL", "925", "355"));
    countries.push(new Country("Finland", "FIN", "1070", "280"));
    countries.push(new Country("Portugal", "PRT", "925", "435"));
    countries.push(new Country("Croatia", "HRV", "1030", "405"));
    countries.push(new Country("Mexico", "MEX", "520", "520"));
    countries.push(new Country("Peru", "PER", "635", "655"));
    countries.push(new Country("Poland", "POL", "1040", "360"));
    countries.push(new Country("Russia / former Soviet Union", "RUS", "1170", "300"));
    countries.push(new Country("Spain", "ESP", "940", "430"));
    countries.push(new Country("The Netherlands", "NLD", "985", "360"));
    countries.push(new Country("The Philippines", "PHL", "1485", "580"));
    countries.push(new Country("Tunisia", "TUN", "1000", "470"));
    countries.push(new Country("Turkey", "TUR", "1120", "440"));

    return countries;
}

/**
 * Resize event
 */
function resizeMap(){
    
}


/**
 * Loads the data for the map
 */
function load_data() {

    //Clear country data incase this method gets reused
    countries.forEach(country => country.clear());

    //Adding data to d3 map
    d3.queue()
        .defer(d3.json, "../Data/world_map.geojson")
        .defer(d3.csv, "../Data/complete_data.csv", function(row) {

            //Calculations for each row
            //Use settings
            if (!document.getElementById('settings_checkbox_unknown').checked) {
                if (row.YOB.length == 0 || row.YOD.length == 0) return;
            }

            if (row.YOB > $("#slider-range").slider("values", 2)) return;
            if (row.YOD < $("#slider-range").slider("values", 0)) return;

            //Population
            var curr_countries_names = row.worked_in.split("|");
            for (i = 0; i < curr_countries_names.length; i++) {
                var curr_country_name = curr_countries_names[i];
                var curr_country = findObjectByKey(countries, "country_name", curr_country_name);

                if (curr_country != null) {
                    var row_worked_as = row.worked_as.split("|");
                    row_worked_as.forEach(function(part, index) {
                        this[index] = this[index].split(">").pop();
                    }, row_worked_as);

                    curr_country.country_pioneers.push(new Pioneer(row.name, row.image_url, row.link, curr_countries_names, row_worked_as));

                    //Connections
                    for (j = 0; j < curr_countries_names.length; j++) {
                        var connection_name = curr_countries_names[j];
                        if (curr_country_name !== connection_name) {
                            if (curr_country.country_connected_countries.findIndex(x => x == connection_name) === -1) {
                                curr_country.country_connected_countries.push(connection_name);
                            }

                        }
                    }
                }
            }

            //Different Jobs
            for (i = 0; i < countries.length; i++) {
                var curr_country = countries[i];
                var jobs = []
                for (j = 0; j < curr_country.country_pioneers.length; j++) {
                    var curr_pioneer = curr_country.country_pioneers[j];
                    for (u = 0; u < curr_country.country_pioneers.length; u++) {
                        var curr_job = curr_pioneer.pioneer_worked_as[u]
                        if (typeof curr_job !== "undefined") {
                            jobs.push(curr_job);
                        }
                    }
                }
                curr_country.country_jobs = uniq(jobs);
            }
        })
        .await(ready);
}

/**
 * Display a random example to the sidepanel
 */
function show_example_pioneer(pioneers) {

    document.getElementById('pioneers_next_button').hidden = pioneers.length == 1;

    var example_pioneer = pioneers[Math.floor(Math.random() * pioneers.length)];

    document.getElementById('pioneers_ex_name').innerHTML = example_pioneer.pioneer_name;
    document.getElementById('pioneers_ex_image').src = "";
    document.getElementById('pioneers_ex_image').src = example_pioneer.pioneer_image;
    document.getElementById('pioneers_read_more_button').onclick = function() { window.open(example_pioneer.pioneer_link) };
    document.getElementById('pioneers_next_button').onclick = function() {
        var filtered = pioneers.filter(function(value, index, arr) {
            return value !== example_pioneer;
        });
        show_example_pioneer(filtered)
    };
}

/**
 * Display connections between all countries
 */
function show_all_connections(countries) {

    //Calculate connections
    var link = []
    for (var i = 0; i < countries.length; i++) {

        var curr_country = countries[i];

        for (var j = 0; j < curr_country.country_connected_countries.length; j++) {
            var connected_country = findObjectByKey(countries, "country_name", curr_country.country_connected_countries[j]);

            source = [curr_country.country_long, curr_country.country_lat]
            target = [connected_country.country_long, connected_country.country_lat]
            topush = { type: "LineString", coordinates: [source, target] }
            link.push(topush)
        }
    }

    // Add the path
    svg.selectAll("myPath")
        .data(link)
        .enter()
        .append("path")
        .attr("d", function(d) { return path(d) })
        .attr("class", function(d) { return "Link" })
        .style("pointer-events", "none")
        .style("fill", "none")
        .style("stroke", "#00d4db")
        .style("stroke-dasharray", ("2, 4"))
        .style("stroke-width", 3)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1)
}

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

function image_load_error(id) {
    if(document.getElementById(id) != null) document.getElementById(id).src = "../Images/Pioneer-Placeholder.png";
}

//Grid
function makeGrid(pioneers) {

    var allImages = "";
    var symbol = "'";

    for (var i = 0; i < pioneers.length; i++) {
        allImages += '<img id="pioneers_grid_img_' + i + '" src="' + pioneers[i].pioneer_image + '" onclick="window.open(' + symbol + pioneers[i].pioneer_link + symbol + ')" alt="' + pioneers[i].pioneer_name + '" onerror="image_load_error(' + symbol + 'pioneers_grid_img_' + i + '' + symbol + ')">';
    }

    $('#photos').html(allImages);
};

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function uniq(a) {
    var prims = { "boolean": {}, "number": {}, "string": {} },
        objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

function imageExists(image_url) {

    fetch(image_url, { method: 'HEAD' })
        .then(res => {
            if (res.ok) {
                console.log('Image exists.');
                return true;
            } else {
                console.log('Image does not exist.');
                return false;
            }
        }).catch(err => console.log('Error:', err));

}

function sidepanel_info_onclick(){
    var dialog_text =   "In this sidepanel you can see an overview of the pioneers registered between the selected years. " +
                        "You can also see how many different jobs these women had in total and in how many countries they worked. " +
                        "Those countries are therefore called 'connected' and displayed with blue dotted lines. " +
                        "Note that this data does not primarily include international collaboration of film studios but rather international working of individual persons. " +
                        "<br/><br/>" +
                        "Besides that, there is also an example pioneer given who was working in the selected country in this time period. " +
                        "If you want to know more about the example pioneer you can click on the 'Read more' button to visit her WFPP biography.";

    open_dialog(dialog_text);
}

function settingspanel_info_onclick(){
    var dialog_text =   "In the settings panel, you can use additional functions to specify the data displayed. " +
                        "<br/><br/>" +
                        "The 'Include Unknown Dates' checkbox allows you to include pioneers which have unknown birth or death dates. " +
                        "<br/>" +
                        "The 'Show all connections' button allows you to see all international working between all countries in the selected time period. " +
                        "Note that this data does not primarily include international collaboration of film studios but rather international working of individual persons.";

    open_dialog(dialog_text);
}

function slider_info_onclick(){
    var dialog_text =   "This slider can be used to specify the time period the data is selected from. " +
                        "The pioneers you will see, are those who were alive in the selected time period. " +
                        "To be exact, you see those which were born before the date of the right handle and died after the date of the left handle. " +
                        "You can use this selection to see which time periods have missing data.";

    open_dialog(dialog_text);
}

function open_dialog(dialog_text){
    $( "#dialog" ).html("<p>" + dialog_text + "</p>");
    $( "#dialog" ).dialog({
        width: "50%"
      });
}