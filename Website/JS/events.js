var event_container = d3.select(".event-timeline-container");
var events = event_container.append("svg")
    .style("width", 1200 + "px")
    .style("height", 5000 + "px");

const EVENTFILL = "#ddd";
const W = 1200;
var H = 0;
var cYOB = 9999;
var cYOD = 0;
const M = 0;
var event_list = [];

const add_event_button = document.getElementById("add-event-button");
add_event_button.addEventListener("click", function (event) {
    d3.select(".data-timeline-container").style("height", 76 + "vh");
    let event_name = document.getElementById("event-name").value;
    let event_start = document.getElementById("event-start").value;
    let event_end = document.getElementById("event-end").value;
    for (let char of event_start) {
        if (!isNumberKey(char)) {
            alert(`${event_start} is not a valid starting year`);
            return;
        }
    }
    for (let char of event_end) {
        if (!isNumberKey(char)) {
            alert(`${event_end} is not a valid ending year`);
            return;
        }
    }
    addEvent(event_name, +event_start, +event_end);
});

function addEvent(name, start, end) {

    document.getElementById("data-timeline").childNodes.forEach(child => {
        if (child.__data__.YOB < cYOB) {
            cYOB = child.__data__.YOB;
        }
        if (child.__data__.YOD > cYOD) {
            cYOD = child.__data__.YOD;
        }
    });

    try {
        if (start > cYOD) {
            alert(`${start} is too big to be a starting year`);
            return;
        }
        if (end < cYOB) {
            alert(`${end} is too small to be an ending year`);
            return;
        }
        for (let item of event_list) {
            if (item.name == name) {
                alert(`${name} is already an event`)
                return;
            }
        }
        if (start < cYOB) {
            start = cYOB
        }
        if (end > cYOD) {
            end = cYOD
        }
        event_container.style("display", "block");
        var object = {
            name: name,
            YOB: start,
            YOD: end,
        };
        console.log("Adding " + name + " " + start + " " + end + " to events");
        event_list.push(object);
        H = H + 20;
        renderEvents();
        document.getElementById("event-name").value = "";
        document.getElementById("event-start").value = "";
        document.getElementById("event-end").value = "";
    } catch (error) {
        renderEvents();
        console.log(error + "\nUnable to create new event from given input");
    }
}

function renderEvents() {
    event_list = event_list.slice().map((e, i) => ({ ...e, yIndex: i }));
    const xScale = d3.scaleLinear()
        .domain([cYOB, cYOD])
        .range([0, W]);

    const yScale = d3.scaleBand()
        .domain(event_list.map(d => d.name))
        .range([M, H])
        .paddingInner(0.2);

    var g = events.selectAll("g")
        .data(event_list)
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
        .attr("height", 12)
        .style("fill", `${EVENTFILL}`)
        .style("fill-opacity", 1);

    g.append("text")
        .attr('transform', d => `translate(${xScale(d.YOB)}, ${yScale(d.name)})`)
        .text(d => d.name)
        .attr('x', d => ((xScale(d.YOD) - xScale(d.YOB)) / 2))
        .attr('y', yScale.bandwidth() - 7)
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .style("opacity", "1");
}

function isNumberKey(char){
    const charCode = char.charCodeAt(0);
    if (charCode >= 48 && charCode <= 57){
        return true;
    }
    return false;
}
