import {
    select, csv, scaleLinear,
    max, min, scaleBand,
    axisTop, format, ascending,
    descending, pointer
} from "d3";

const svg = select(".timeline");
const H = svg.node().getBoundingClientRect().height;
const W = svg.node().getBoundingClientRect().width;
const M = 20;

var data;
var naiveData = [];
var tooltip = select(".tooltip");

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
    const event_text = document.getElementById("event-text");
    alert(event_text.value);
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
    svg.selectAll('rect').remove();
    svg.selectAll('text').remove();
    select("#xAxis").selectAll("svg").remove();
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

    const g = svg.append('g')
        .attr('transform', `translate(0, 20)`);

    const e = g
        .selectAll("g.name")
        .data(naiveData)
        .join('g')
        .attr('class', 'name')
        .attr('transform', d => `translate(${xScale(d.YOB)}, ${yScale(d.name) - 30})`)
        .on("mouseenter", (e, d) => {
            let [x, y] = pointer(e);
            console.log("Mouse entered");
            console.log(x, y);
            tooltip
                .style("height", "50px")
                .style("width", "50px")
                .style("left", `${x + 350}px`)
                .style("top", `${y + 15}px`)
                .style("opacity", 1)
                .style("background-color", "black")
            /*
            selection
            .append("rect")
            .attr("id", "tooltip")
            .attr("width", 50)
            .attr("height", 50)
            .attr('y', 0)
            .attr('x', d => {
                return selection.select("rect").attr("width") / 2;
            })
            .attr("fill", "white")
            .style("fill-opacity", 1)
            .append("text")
                .text(d => {
                    return d.name + "\n" + d.YOB + "-" + d.YOD;
                })
                .style('font-size', '15px')
                .style('font-weight', 'bold')
                .style('opacity', '1')
                .style('fill', 'black');
                */
        })
        .on("mouseleave", function () {
            tooltip.style("opacity", 0);
            console.log("Mouse left");
        });

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
            return "rgb(0, 150, 0)";
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