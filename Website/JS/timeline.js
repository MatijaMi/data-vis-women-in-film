import {
    select, csv, scaleLinear,
    max, min, scaleBand,
    axisTop, format, ascending,
    descending, pointer, selectAll
} from "d3";

const svg = select(".timeline");
const H = svg.node().getBoundingClientRect().height;
const W = svg.node().getBoundingClientRect().width;
const M = 20;
const defaultFill = "#009600";
const hoverFill = "#005600";

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
    naiveData.sort((a, b) => ascending(a.YOB, b.YOB));
    render();
}

function sortByYOBDesc() {
    naiveData.sort((a, b) => descending(a.YOB, b.YOB));
    render();
}

function sortByNameAsc() {
    naiveData.sort((a, b) => ascending(a.name, b.name));
    render();
}

function sortByNameDesc() {
    naiveData.sort((a, b) => descending(a.name, b.name));
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
    select("#xAxis").selectAll("svg").remove();
}

function render() {
    naiveData = naiveData.slice().map((e, i) => ({ ...e, yIndex: i }));

    console.log(naiveData);

    const xScale = scaleLinear()
        .domain([min(naiveData, d => d.YOB), max(naiveData, d => d.YOD)])
        .range([0, W]);

    const yScale = scaleBand()
        .domain(naiveData.map(d => d.name))
        .range([M, H - M])
        .paddingInner(0.2);

    select("#xAxis")
        .append("svg")
        .attr("width", W)
        .attr("height", 20)
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, 15)")
        .call(axisTop(xScale)
            .tickFormat(format(".0f"))
            .tickSize(-(H - M))
            .ticks(34));


    var g = svg.selectAll("g")
        .data(naiveData)
        .enter()
        .append("g")

    g.append("rect")
        .attr("transform", d => `translate(${xScale(d.YOB)}, ${yScale(d.name)})`)
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
        select(this)
            .select("rect")
            .style("fill", `${hoverFill}`);/*
            .append("g")
            .attr("class", "tooltip")
            .style("box-shadow", "0px 8px 16px 0px rgba(0, 0, 0, 0.2)")
            .style("z-index", "1")
            .append("rect")
            .style("width", "15%")
            .style("height", "50px")
            .attr("x", pointer(e)[0])
            .style("fill", "white")
            .style("fill-opacity", "0.9");
        selectAll(".tooltip")
            .append("text")
            .attr("x", pointer(e)[0])
            .attr("y", 20)
            .append("tspan")
            .attr("x", pointer(e)[0])
            .attr("y", 20)
            .text(d => { return d.name })
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('opacity', '1')
            .style('fill', 'black')
            .append("tspan")
            .attr("x", pointer(e)[0])
            .attr("y", 40)
            .style("width", "15%")
            .style("height", "50px")
            .text(d => { return d.YOB + "-" + d.YOD })
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('opacity', '1')
            .style('fill', 'black');*/

    })
        .on("mouseleave", function (e, d) {
            select(this)
                .select("rect")
                .style("fill", `${defaultFill}`);
            selectAll(".tooltip").remove();
        });
}

function getData() {
    csv("/Website/Data/complete_data.csv").then(d => {
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
}

getData();