import { select, csv, scaleLinear, max, min, scaleBand, axisLeft, axisTop } from "d3";

const svg = select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
    const xValue = d => d.YOB;
    const xEnd = d => d.YOD;
    const yValue = d => d.name;
    const margin = { top: 40, right: 40, bottom: 50, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;


    const xScale = scaleLinear()
        .domain([1841, max(data, xEnd)])
        .range([0, innerWidth]);

    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g").call(axisLeft(yScale));
    g.append("g").call(axisTop(xScale));

    g.selectAll("rect").data(data)
        .enter()
        .append("rect")
            .attr("y", d => yScale(yValue(d)))
            .attr("width", d => xScale(xValue(d)))
            .attr("height", yScale.bandwidth());

};

csv("/Website/Data/complete_data.csv").then(data => {
    data = data.map(d => {
        return {
            ...d,
            start: +d.YOB,
            end: +d.YOD
        };
    }).sort((a,b) => a.YOB - b.YOB);
    data.forEach(d => {
        d.YOB = +d.YOB;
        d.YOD = +d.YOD;
    });
    console.log(data);
    render(data);
})