import { select, csv, scaleLinear, max, min, scaleBand, axisLeft, axisTop, range, format } from "d3";

const svg = select("svg");

async function parseData() {
    return csv("/Website/Data/complete_data.csv");
}

async function render() {
    const H = 3500;
    const W = 1280;
    const M = 20;

    let data = await parseData();
    data.sort((a, b) => a.YOB - b.YOB);

    var naiveData = [];
    data.forEach(d => {
        if (d.YOB == "" || d.YOD == "") {
            return;
        };
        d.YOB = +d.YOB;
        d.YOD = +d.YOD;
        naiveData.push(d)
    });

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

    g.append('g')
        .call(axisTop(xScale)
            .tickFormat(format(".0f"))
            .tickSize(-(H - M))
            .ticks(34));

    const e = g
        .selectAll("g.name")
        .data(naiveData)
        .join('g')
        .attr('class', 'name')
        .attr('transform', d => `translate(${xScale(d.YOB)}, ${yScale(d.name)})`);

    e.append('rect')
        .attr(
            "width",
            d =>
            (d.YOB >= d.YOD
                ? 3
                : xScale(d.YOD) - xScale(d.YOB))
        )
        .attr('height', yScale.bandwidth())
        .attr('fill', 'rgb(0,255,0)')
        .attr('fill-opacity', 1);

    e.append('text')
        .attr('y', yScale.bandwidth() - 1)
        .attr('x', d => (xScale(d.YOD) - xScale(d.YOB)) / 2)
        .text(d => d.name)
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('opacity', '1')
        .style('fill', 'black');

}
render();