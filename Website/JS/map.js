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
        this.country_long = long - 325;
        this.country_lat = lat - 130;
    }

    clear() {
        this.country_connected_countries.length = 0
        this.country_pioneers.length = 0
        this.country_jobs.length = 0
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
    countries.push(new Country("New Zealand", "NZL", "1700", "850"));
    countries.push(new Country("Austria", "AUT", "1025", "395"));
    countries.push(new Country("China", "CHN", "1400", "450"));
    countries.push(new Country("Germany", "DEU", "1010", "355"));
    countries.push(new Country("Hungary", "HUN", "1045", "395"));
    countries.push(new Country("Brazil", "BRA", "750", "680"));
    countries.push(new Country("Canada", "CAN", "500", "300"));
    countries.push(new Country("Italy", "ITA", "1010", "420"));
    countries.push(new Country("France", "FRA", "970", "400"));
    countries.push(new Country("Chile", "CHL", "645", "845"));
    countries.push(new Country("Japan", "JPN", "1565", "460"));
    countries.push(new Country("Colombia", "COL", "645", "615"));
    countries.push(new Country("Czechoslovakia", "CZE", "1025", "380"));
    countries.push(new Country("Denmark", "DNK", "1000", "330"));
    countries.push(new Country("Norway", "NOR", "990", "290"));
    countries.push(new Country("Sweden", "SWE", "1020", "290"));
    countries.push(new Country("Ireland", "IRL", "925", "355"));
    countries.push(new Country("Finland", "FIN", "1070", "280"));
    countries.push(new Country("Portugal", "PRT", "925", "435"));
    countries.push(new Country("Mexico", "MEX", "520", "520"));
    countries.push(new Country("Peru", "PER", "635", "655"));
    countries.push(new Country("Poland", "POL", "1040", "360"));
    countries.push(new Country("Russia", "RUS", "1170", "300"));
    countries.push(new Country("Spain", "ESP", "940", "430"));
    countries.push(new Country("The Netherlands", "NLD", "985", "360"));
    countries.push(new Country("The Philippines", "PHL", "1485", "580"));
    countries.push(new Country("Tunisia", "TUN", "1000", "470"));
    countries.push(new Country("Turkey", "TUR", "1120", "440"));

    return countries;
}

/**
 * Loads the data for the map
 */
function load_data() {

    //Clear country data incase this method gets reused
    countries.forEach(country => country.clear());

    //Set country data
    add_pioneers_to_countries();

    //Adding data to d3 map
    d3.queue()
        .defer(d3.json, "Data/world_map.geojson")
        .await(ready);
}

function add_pioneers_to_countries() {

    //Get pioneers
    var pioneers = getAllPioneers();

    //Only view valid dates
    pioneers = pioneers.filter(x => x.birth_date instanceof Date && !isNaN(x.birth_date));
    pioneers = pioneers.filter(x => x.death_date instanceof Date && !isNaN(x.death_date));


    //Add to countries
    pioneers.forEach(pioneer => {
        //Use settings
        if (pioneer.birth_date.getFullYear() > $("#slider-range").slider("values", 2)) return;
        if (pioneer.death_date.getFullYear() < $("#slider-range").slider("values", 0)) return;

        //Population
        var curr_countries_names = pioneer.worked_in;
        for (i = 0; i < curr_countries_names.length; i++) {
            var curr_country_name = curr_countries_names[i];
            var curr_country = findObjectByKey(countries, "country_name", curr_country_name);

            if (curr_country != null) {
                var row_worked_as = pioneer.worked_as;
                row_worked_as.forEach(function (part, index) {
                    this[index] = this[index].split(">").pop();
                }, row_worked_as);

                //Add pioneer
                curr_country.country_pioneers.push(pioneer);

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
                    var curr_job = curr_pioneer.worked_as[u];
                    if (typeof curr_job !== "undefined") {
                        jobs.push(curr_job);
                    }
                }
            }
            curr_country.country_jobs = uniq(jobs);
        }
    });
}

/**
 * Displayes an example pioneer to the sidepanel
 * @param {*} pioneers Pioneers that weren't displayed yet
 * @param {*} all_pioneers A list of all pioneers of the country and time
 * @param {*} last_pioneer The last pioneer that was shown
 */
function show_example_pioneer(pioneers, all_pioneers, last_pioneer) {

    //All pioneers were shown once, therefore we reset the list
    if (pioneers.length == 0) pioneers = all_pioneers;

    //If there is only one pioneer we dont show the next button
    document.getElementById('pioneers_next_button').hidden = all_pioneers.length == 1;

    //Get random pioneer
    var example_pioneer = pioneers[Math.floor(Math.random() * pioneers.length)];

    //Make sure the random pioneer wasn't the last one shown before list reset
    while (all_pioneers.length > 1 && example_pioneer == last_pioneer) {
        example_pioneer = pioneers[Math.floor(Math.random() * pioneers.length)];
    }

    //Display values for the random pioneer
    document.getElementById('pioneers_ex_name').innerHTML = example_pioneer.name;
    document.getElementById('pioneers_ex_image').src = "";
    document.getElementById('pioneers_ex_image').src = example_pioneer.image_url;
    document.getElementById('pioneers_read_more_button').onclick = function () { window.open(example_pioneer.link) };

    //Set the onclick function for the next button
    document.getElementById('pioneers_next_button').onclick = function () {
        var filtered = pioneers.filter(function (value, index, arr) {
            return value !== example_pioneer;
        });
        show_example_pioneer(filtered, all_pioneers, example_pioneer)
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
        .attr("d", function (d) { return path(d) })
        .attr("class", function (d) { return "Link" })
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
    if (document.getElementById(id) != null) document.getElementById(id).src = "Images/Unknown.jpg";
}

function uniq(a) {
    var prims = { "boolean": {}, "number": {}, "string": {} },
        objs = [];

    return a.filter(function (item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

function sidepanel_info_onclick() {
    var dialog_text = "In this sidepanel you can see an overview of the pioneers registered between the selected years. " +
        "You can also see how many different jobs these women had in total and in how many countries they worked. " +
        "Those countries are therefore called 'connected' and displayed with blue dotted lines. " +
        "Note that this data does not display international collaborations of film studios but rather transnational biographies of individuals. " +
        "<br/><br/>" +
        "Besides, the website also features a pioneer, selected on a random basis, who was working in the selected country during the selected time period." +
        "If you would like to learn more about the pioneer displayed you can click on the 'Read more' button to visit her WFPP biography.";

    open_dialog(dialog_text);
}

function settingspanel_info_onclick() {
    var dialog_text = "In this panel you can access the other visualizations to get a different view of the selected data. " +
        "<br/><br/>" +
        "The 'Show all connections' button allows you to see all international connections within the selected time period regardless the selected country. " +
        "Note that this data does not display international collaborations of film studios but rather transnational biographies of individuals." +
        "<br/>" +
        "The 'Show as timeline' and 'Show as cluster' buttons link you to the respective visualization based on the selected country and time period.";

    open_dialog(dialog_text);
}

function slider_info_onclick() {
    var dialog_text = "This slider can be used to specify the time period of the data displayed. " +
        "The pioneers you will see are those who were alive in the selected time period. " +
        "To be exact, you see those who were born before the date of the right handle and died after the date of the left handle. " +
        "You can also use this function to identify missing data of certain time periods. " +
        "<br/><br/>" +
        "The pictograms on the left can be used to display some statists.";
    open_dialog(dialog_text);
}

function open_dialog(dialog_text) {
    $("#dialog").html("<p>" + dialog_text + "</p>");
    $("#dialog").dialog({
        width: "50%"
    });
}

function histogram_button_onclick() {
    //Check if it is hidden
    var is_hidden = document.getElementById('histogram_holder').hidden;

    //Stop hiding
    is_hidden = !is_hidden;
    document.getElementById('histogram_holder').hidden = is_hidden;

    if (is_hidden) {
        document.getElementById('map_holder').style.height = "calc(80vh - 30px)";
    }
    else {
        document.getElementById('map_holder').style.height = "calc(60vh - 30px)";
    }
}

function CheckSizeZoom() {
    var minW = 1800;
    if ($(window).width() < minW) {
        var zoomLev = $(window).width() / minW;


        if (typeof (document.body.style.zoom) != "undefined") {
            $("#map_holder").css('zoom', zoomLev);
        }
        else {
            // Mozilla doesn't support zoom, use -moz-transform to scale and compensate for lost width
            $('#map_holder').css('-moz-transform', "scale(" + zoomLev + ")");
            $('#map_holder').width($(window).width() / zoomLev + 10);
            $('#map_holder').css('position', 'relative');
            $('#map_holder').css('left', (($(window).width() - minW - 16) / 2) + "px");
            $('#map_holder').css('top', "-19px");
            $('#map_holder').css('position', 'relative');
        }
    }
    else {
        $("#map_holder").css('zoom', '');
        $('#map_holder').css('position', '');
        $('#map_holder').css('left', "");
        $('#map_holder').css('top', "");
        $('#map_holder').css('-moz-transform', "");
        $('#map_holder').width("");
    }
}


/**
 * Create a pie chart of the top pioneers count of countries in the selected time span
 * @param {Number of chart pieces created - E.g. 5 for Top 5} top 
 */
function CreatePieChart(top) {

    //Copy array
    temp_countries = countries.slice();

    //Remove empty
    temp_countries = temp_countries.filter((x) => x.country_pioneers.length > 0);

    //Sort Countries
    temp_countries.sort((a, b) => (a.country_pioneers.length < b.country_pioneers.length) ? 1 : ((b.country_pioneers.length < a.country_pioneers.length) ? -1 : 0))

    //Convert to anychart data
    data = temp_countries.slice(0, top).map((x) => [x.country_name, x.country_pioneers.length]);

    //Add other Countries sum
    if (temp_countries.slice(0, top).length == top) {
        var other_countries_sum = temp_countries.slice(top, temp_countries.length).reduce((a, b) => a + b.country_pioneers.length, 0);
        data[data.length] = (["Other Countries", other_countries_sum]);
    }

    // create pie chart with passed data
    var chart = anychart.pie(data);

    //Modal Chart
    anychart.theme("darkBlue");

    // create standalone label and set settings
    var label = anychart.standalones.label();
    label
        .enabled(true)
        .text("Countries with most pioneers between " + $("#slider-range").slider("values", 0) + " and " + $("#slider-range").slider("values", 2))
        .width("100%")
        .height("100%")
        .adjustFontSize(true, true)
        .minFontSize(18)
        .maxFontSize(25)
        .fontColor("#cccccc")
        .position("center")
        .anchor("center")
        .hAlign("center")
        .vAlign("middle");

    // set label to center content of chart
    chart.center().content(label);

    // set chart title text settings
    chart
        // set chart radius
        .radius("43%")
        // create empty area in pie chart
        .innerRadius("40%")
        .explode(0);

    //Onclick
    chart.listen("pointClick", function (e) {

        //Get name by iterator
        var click_country_name = e.iterator.get("x");

        //Find id
        var temp_country = countries.find(country => country.country_name == click_country_name);

        //Break
        if (temp_country == undefined) return;

        //Find feature
        var feature = temp_map_data.features.find(country => country["id"] == temp_country.country_code);

        //Simulate click on country
        mouseClick(feature);

    });

    chart.legend().listen("click", function (e) {

        //Get name
        var click_country_name = data[e.itemIndex][0];

        //Find id
        var temp_country = countries.find(country => country.country_name == click_country_name);

        //Break
        if (temp_country == undefined) return;

        //Find feature
        var feature = temp_map_data.features.find(country => country["id"] == temp_country.country_code);

        //Simulate click on country
        mouseClick(feature);
    });


    // set container id for the chart
    chart.container("country_pie_chart");
    // initiate chart drawing
    chart.draw();
}

var temp_map_data;

function CreateBarChart() {

    //Copy array
    temp_countries = countries.slice();

    //Sort Countries
    temp_countries.sort((a, b) => (a.country_pioneers.length < b.country_pioneers.length) ? 1 : ((b.country_pioneers.length < a.country_pioneers.length) ? -1 : 0))

    //Convert to anychart data
    data = temp_countries.map((x) => [x.country_name, x.country_pioneers.length]);

    // set chart theme
    anychart.theme("darkBlue");

    // create bar chart
    var chart = anychart.bar(data);

    chart.padding([10, 40, 5, 20]);

    chart.title(
        "Pioneers per country between " + $("#slider-range").slider("values", 0) + " and " + $("#slider-range").slider("values", 2)
    );

    // set tooltip settings
    chart
        .tooltip()
        .position("right")
        .anchor("left-center")
        .offsetX(5)
        .offsetY(0)
        .titleFormat("{%X}")
        .format("{%Value}");

    // set yAxis labels formatter
    chart.yAxis().labels().format("{%Value}{groupsSeparator: }");

    // set titles for axises
    chart.interactivity().hoverMode("by-x");
    chart.tooltip().positionMode("point");
    // set scale minimum
    chart.yScale().minimum(0);

    //Onclick
    chart.listen("pointClick", function (e) {
        //Get name by iterator
        var click_country_name = e.iterator.get("x");

        //Find id
        var temp_country = countries.find(country => country.country_name == click_country_name);

        //Break
        if (temp_country == undefined) return;

        //Find feature
        var feature = temp_map_data.features.find(country => country["id"] == temp_country.country_code);

        //Simulate click on country
        mouseClick(feature);

    });

    // set container id for the chart
    chart.container("country_bar_chart");
    // initiate chart drawing
    chart.draw();
}

function CreateHisto() {

    //Data copied from map_histogram_ipynb
    var data =
        [[1835, 0],
        [1840, 0],
        [1845, 3],
        [1850, 4],
        [1855, 6],
        [1860, 9],
        [1865, 19],
        [1870, 28],
        [1875, 55],
        [1880, 75],
        [1885, 112],
        [1890, 156],
        [1895, 202],
        [1900, 245],
        [1905, 268],
        [1910, 275],
        [1915, 276],
        [1920, 274],
        [1925, 269],
        [1930, 262],
        [1935, 249],
        [1940, 236],
        [1945, 216],
        [1950, 200],
        [1955, 176],
        [1960, 159],
        [1965, 137],
        [1970, 114],
        [1975, 84],
        [1980, 58],
        [1985, 36],
        [1990, 16],
        [1995, 7],
        [2000, 3]
        ];

    //Set chart theme
    anychart.theme("darkBlue");

    //Create histo
    var chart = anychart.column(data);

    //Add space to bottom
    chart.padding([10, 10, 15, 0]);

    //Title
    chart.title("Pioneers alive per timespan");

    //Set tooltip settings
    chart.tooltip().titleFormat('{%X}');
    chart
        .tooltip()
        .position('center-top')
        .anchor('center-bottom')
        .offsetX(0)
        .offsetY(0)
        .format('{%Value}{groupsSeparator: }');

    // set titles for axises
    chart.interactivity().hoverMode("by-x");
    chart.tooltip().positionMode("point");

    // set scale minimum
    chart.yScale().minimum(0);

    // set container id for the chart
    chart.container("histogram_holder");

    // initiate chart drawing
    chart.draw();
}