class LineGraph {
    constructor(parentElement, displayData) {
        this.parentElement = parentElement;
        this.displayData = displayData;

        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.parseYear = d3.timeParse("%Y");

        vis.margin = {
            top: 50,
            right: 80,
            bottom: 50,
            left: 50
        };

        vis.width = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.9 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleTime()
            .domain(d3.extent(vis.displayData, d => vis.parseYear(d.date)))
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .domain([0, 35])
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d => d + "%")
            .ticks(5);

        vis.svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);



        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip-line")
            .style("opacity", 0)
            .style("position", "absolute");


        vis.line = d3.line()
            .x(d => vis.x(vis.parseYear(d.date)))
            .y(d => vis.y(parseFloat(d.percent)))
            .curve(d3.curveMonotoneX);




        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.technologyData = vis.displayData.filter(d => d.industry === "Technology");
        vis.financialData = vis.displayData.filter(d => d.industry === "Financial");
        vis.energyData = vis.displayData.filter(d => d.industry === "Energy")

        this.updateVis();
    }

    updateVis() {
        let vis = this;

        let lines = vis.svg.selectAll("line")
            .data([vis.technologyData, vis.financialData, vis.energyData])
            .enter()
            .append("g");

        lines.append("path")
            .attr('clip-path', 'url(#clip)')
            .attr("fill", "none")
            .style("stroke", function (d, i) {
                if (i === 0) {
                    return "#bd93f9";
                } else {
                    return "#d2d2d2";
                }
            })
            .style("stroke-width", "2")
            .attr("d", d => vis.line(d));

        lines.append("text")
            .attr("class", "serie_label")
            .datum(function (d) {
                return d[d.length - 1];
            })
            .attr("transform", function (d) {
                return `translate(${vis.x(vis.parseYear(d.date)) + 10}, ${vis.y(parseFloat(d.percent)) + 5})`;
            })
            .attr("x", 5)
            .style("fill", function (d, i) {
                if (i === 0) {
                    return "#d2d2d2";
                } else {
                    return "#d2d2d2";
                }
            })
            .text(d => d.industry);

        const ghost_lines = lines.append("path")
            .attr("class", "ghost-line")
            .attr("d", function (d) {
                return vis.line(d);
            });

        vis.svg.selectAll(".ghost-line")
            .on('mouseover', function (event, d) {
                if (d[0].industry !== "Technology") {
                    const selection = d3.select(this).raise();

                    selection
                        .transition()
                        .delay("100").duration("10")
                        .style("stroke", "#ffb86c")
                        .style("opacity", "1")
                        .style("stroke-width", "3");

                    // add the legend action
                    const legend = d3.select(this.parentNode)
                        .select(".serie_label");

                    legend
                        .transition()
                        .delay("100")
                        .duration("10")
                        .style("fill", "#fafafa");
                }
            })

            .on('mouseout', function () {
                const selection = d3.select(this)

                selection
                    .transition()
                    .delay("100")
                    .duration("10")
                    .style("stroke", "#d2d2d2")
                    .style("opacity", "0")
                    .style("stroke-width", "10");

                // add the legend action
                const legend = d3.select(this.parentNode)
                    .select(".serie_label");

                legend
                    .transition()
                    .delay("100")
                    .duration("10")
                    .style("fill", function (d) {
                        if (d.industry === "Technology") {
                            return "black";
                        } else {
                            return "#d2d2d2";
                        }
                    });
            });

        let majorEvents = {
            "1997": "Amazon IPO",
            "1999": "Peak of dot-com bubble",
            "2002": "Netflix IPO",
            "2004": "Googe IPO",
            "2007": "First iPhone released",
            "2012": "Facebook IPO",
            "2018": "Amazon and Apple become first companies to hit $1 trillion market cap",
            "2020": "Apple becomes first company to hit $2 trillion market cap"
        };

        let techLines = vis.svg.selectAll("line")
            .data([vis.technologyData])
            .enter()
            .append("g");

        techLines.selectAll("points")
            .data(function (d) {
                return d;
            })
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return vis.x(vis.parseYear(d.date));
            })
            .attr("cy", function (d) {
                return vis.y(parseFloat(d.percent));
            })
            .attr("r", function (d) {
                if (d.industry === "Technology" && Object.keys(majorEvents).indexOf(d.date) !== -1) {
                    return 5;
                } else {
                    return 0;
                }
            })
            .attr("class", "point")
            .style("opacity", 1);


        techLines.selectAll("circles")
            .data(function (d) {
                return (d);
            })
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return vis.x(vis.parseYear(d.date));
            })
            .attr("cy", function (d) {
                return vis.y(parseFloat(d.percent));
            })
            .attr('r', 10)
            .style("opacity", 0)
            .on('mouseover', function (event, d) {
                vis.tooltip.transition()
                    .delay(30)
                    .duration(200)
                    .style("opacity", 1);

                vis.tooltip.html(
                        `
            <div style="border: thin solid grey; border-radius: 5px; background: #555555; padding: 20px">
                <h6> Year: ${d.date}</h6>
                <h6> Weight: ${d.percent}%</h6>
                <h6>${majorEvents[d.date]  && d.industry === "Technology" ? 'Major Event: ' + majorEvents[d.date] : ''}</h6>                         
            </div>`
                    )
                    .style("left", (event.pageX + 25) + "px")
                    .style("top", (event.pageY) + "px");

                const selection = d3.select(this).raise();

                selection
                    .transition()
                    .delay("20")
                    .duration("200")
                    .attr("r", 6)
                    .style("opacity", 1)
                    .style("fill", 'white');
            })
            .on("mouseout", function (d) {
                vis.tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);

                const selection = d3.select(this);

                selection
                    .transition()
                    .delay("20")
                    .duration("200")
                    .attr("r", 10)
                    .style("opacity", 0);
            });

        vis.svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // Add the x-axis.
        vis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);

        // Add the y-axis.
        vis.svg.append("g")
            .attr("class", "y axis")
            .call(vis.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("dy", ".75em")
            .attr("y", 6)
            .style("text-anchor", "end")
            .text("S&P Sector Weight");

        let curtain = vis.svg.append('rect')
            .attr('x', -1 * vis.width - 5)
            .attr('y', -1 * vis.height)
            .attr('height', vis.height)
            .attr('width', vis.width)
            .attr('class', 'curtain')
            .attr('transform', 'rotate(180)')
            .style('fill', '#2c2c2c')

        document.addEventListener('aos:out:aos-line', () => {
            d3.select('rect.curtain').attr('x', -1 * vis.width - 5);
        })

        document.addEventListener('aos:in:aos-line', ({
            detail
        }) => {
            let t = vis.svg.transition()
                .delay(750)
                .duration(6000)
                .ease(d3.easeLinear);

            t.select('rect.curtain')
                .attr('width', 0);
        });

    }

}