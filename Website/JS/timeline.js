const svg = d3.select(".timeline");
const H = svg.node().getBoundingClientRect().height;
const W = svg.node().getBoundingClientRect().width;
const M = 20;
const defaultFill = "#009600";
const hoverFill = "#005600";

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("padding", "10px")
    .style("background", "rgba(0,0,0,0.7)")
    .style("border-radius", "4px")
    .style("color", "#fff")
    .text("a simple tooltip")
    .style("text-align", "left");

var data;
var naiveData = [];

const yob_asc_button = document.getElementById("yob-sort-asc-button");
yob_asc_button.addEventListener("click", function (event) {
    sorting(yob_asc_button);
});

const yob_desc_button = document.getElementById("yob-sort-desc-button");
yob_desc_button.addEventListener("click", function (event) {
    sorting(yob_desc_button);
});

const name_asc_button = document.getElementById("name-sort-asc-button");
name_asc_button.addEventListener("click", function (event) {
    sorting(name_asc_button);
});

const name_desc_button = document.getElementById("name-sort-desc-button");
name_desc_button.addEventListener("click", function (event) {
    sorting(name_desc_button);
});

const add_event_button = document.getElementById("add-event-button");
add_event_button.addEventListener("click", function (event) {
    var event_text = document.getElementById("event-text");
    addEvent(event_text.value);
    event_text.value = "";
});

function sortByYOBAsc() {
    naiveData.sort((a, b) => d3.ascending(a.YOB, b.YOB));
    render();
}

function sortByYOBDesc() {
    naiveData.sort((a, b) => d3.descending(a.YOB, b.YOB));
    render();
}

function sortByNameAsc() {
    naiveData.sort((a, b) => d3.ascending(a.name, b.name));
    render();
}

function sortByNameDesc() {
    naiveData.sort((a, b) => d3.descending(a.name, b.name));
    render();
}

function sorting(button) {
    cleanUp();
    if (button.id == "yob-sort-asc-button") {
        sortByYOBAsc();
        return;
    }
    if (button.id == "yob-sort-desc-button") {
        sortByYOBDesc();
        return;
    }
    if (button.id == "name-sort-asc-button") {
        sortByNameAsc();
        return;
    }
    if (button.id == "name-sort-desc-button") {
        sortByNameDesc();
        return;
    }
}

function addEvent(input) {
    cleanUp();
    try {
        let [name, dates] = input.split(":");
        var [begin, end] = dates.split(" ");
        console.log(name, begin, end);
        var object = {
            name: name,
            YOB: begin,
            YOD: end,
        };
        naiveData.push(object);
        render();
    } catch (error) {
        render();
        console.log(error + "\nUnable to create new event from given input");
    }
}

function cleanUp() {
    svg.selectAll("g").remove();
    d3.select("#xAxis").selectAll("svg").remove();
}

function render() {
    naiveData = naiveData.slice().map((e, i) => ({ ...e, yIndex: i }));

    console.log(naiveData);

    const xScale = d3.scaleLinear()
        .domain([d3.min(naiveData, d => d.YOB), d3.max(naiveData, d => d.YOD)])
        .range([0, W]);

    const yScale = d3.scaleBand()
        .domain(naiveData.map(d => d.name))
        .range([M, H - M])
        .paddingInner(0.2);

    d3.select("#xAxis")
        .append("svg")
        .attr("width", W)
        .attr("height", 20)
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, 12)")
        .call(d3.axisTop(xScale)
            .tickFormat(d3.format(".0f"))
            .tickSize(-(H - M))
            .ticks(34));

    var g = svg.selectAll("g")
        .data(naiveData)
        .enter()
        .append("g")

    g.append("rect")
        .attr("transform", d => `translate(${xScale(d.YOB) + 8}, ${yScale(d.name)})`)
        .attr(
            "width",
            d =>
            (d.YOB >= d.YOD
                ? 3
                : xScale(d.YOD) - xScale(d.YOB))
        )
        .attr("height", yScale.bandwidth())
        .style("fill", defaultFill)
        .style("fill-opacity", 1);

    g.append("text")
        .attr('transform', d => `translate(${xScale(d.YOB)}, ${yScale(d.name)})`)
        .text(d => d.name)
        .attr('x', d => ((xScale(d.YOD) - xScale(d.YOB)) / 2))
        .attr('y', yScale.bandwidth() - 3)
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .style("opacity", "1");

    g.on("mouseenter", function (e, d) {
        d3.select(this)
            .select("rect")
            .style("fill", `${hoverFill}`);

        tooltip
            .html(
                `<div style="text-align: center;"><div>${d.name}</div><div">${d.YOB} - ${d.YOD}</div><div"><i>Left click to visit Map</i></div></div>`
            )
            .style("visibility", "visible");
        })
        .on("mousemove", function (e, d) {
            tooltip
                .style("left", e.pageX + 10 + "px")
                .style("top", e.pageY - 50 + "px");
        })
        .on("click", function(e, d) {
            window.open("../HTML/Map.html", "_self")
        })
        .on("mouseleave", function (e, d) {
            d3.select(this)
                .select("rect")
                .style("fill", `${defaultFill}`);
            tooltip.html(``).style('visibility', 'hidden');
        });
}

d3.csv("../Data/timeline_data.csv").then(d => {
    data = d;
    data.sort((a, b) => a.YOB - b.YOB);
    data.forEach(d => {
        if (d.YOB == "" || d.YOD == "") {
            return;
        };
        d.YOB = +d.YOB;
        d.YOD = +d.YOD;
        naiveData.push(d)
    });
    render();
});