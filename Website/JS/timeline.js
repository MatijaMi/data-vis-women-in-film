import { select, csv, scaleLinear, max, min, scaleBand, axisTop, format, ascending, descending } from "d3";

var data;
var naiveData = [];
const svg = select(".timeline");
const H = svg.node().getBoundingClientRect().height;
const W = svg.node().getBoundingClientRect().width;
const M = 20;
let fill = 100;
let asc = false;
let name = true;

var yob_button = document.getElementById("yob-sort-button");
yob_button.addEventListener("click", function (event) {
    sorting(yob_button);
});

var name_button = document.getElementById("name-sort-button");
name_button.addEventListener("click", function (event) {
    sorting(name_button);
})

function sortYOB() {
    if (asc) {
        naiveData.sort((a, b) => ascending(a.YOB, b.YOB));
        asc = false;
    } else {
        naiveData.sort((a, b) => descending(a.YOB, b.YOB));
        asc = true;
    }
}

function sortName() {
    if (name) {
        naiveData.sort((a, b) => ascending(a.name, b.name));
        name = false;
    } else {
        naiveData.sort((a, b) => descending(a.name, b.name));
        name = true;
    }
}

function sortByYOB() {
    sortYOB();
    render();
}

function sortByName() {
    sortName();
    render();
}

function sorting(button) {
    svg.selectAll('rect').remove();
    svg.selectAll('text').remove();
    select("#xAxis").selectAll("svg").remove();
    if (button.id == "yob-sort-button") {
        sortByYOB();
        return;
    }
    if (button.id == "name-sort-button") {
        sortByName();
        return;
    }
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


    const g = svg.append('g')
        .attr('transform', `translate(0, 20)`);

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


    const e = g
        .selectAll("g.name")
        .data(naiveData)
        .join('g')
        .attr('class', 'name')
        .attr('transform', d => `translate(${xScale(d.YOB)}, ${yScale(d.name) - 30})`);

    e.append('rect')
        .attr(
            "width",
            d =>
            (d.YOB >= d.YOD
                ? 3
                : xScale(d.YOD) - xScale(d.YOB))
        )
        .attr('height', yScale.bandwidth())
        .attr('fill', function () {
            fill = fill + 1;
            if (fill > 150) fill = 100;
            return "rgb(0, " + (fill) + ", 0)";
        })
        .style('fill-opacity', 1);

    e.append('text')
        .attr('y', yScale.bandwidth() - 3)
        .attr('x', d => (xScale(d.YOD) - xScale(d.YOB)) / 2)
        .text(d => d.name)
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('opacity', '1')
        .style('fill', 'white');

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