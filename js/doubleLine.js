class DoubleLine {
    constructor(parentElement, surveyData) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {
            top: 20,
            right: 40,
            bottom: 30,
            left: 50
        };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.parseYear = d3.timeParse("%Y");

        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .domain([0, 50])
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(4);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d => d + "%")
            .ticks(5);

        vis.svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);



        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.displayData = [{
                year: "2016",
                count: 0,
            },
            {
                year: "2017",
                count: 0
            },
            {
                year: "2018",
                count: 0,
            },
            {
                year: "2019",
                count: 0,
            }
        ]

        let totalCount = {
            "2016": 0,
            "2017": 0,
            "2018": 0,
            "2019": 0
        }
        vis.surveyData.forEach(el => {
            let disorder = true ? el.disorder === "Yes" : false;
            totalCount[el.year] += 1;

            if (el.year === "2016") {
                vis.displayData[0].count += disorder;
            } else if (el.year === "2017") {
                vis.displayData[1].count += disorder;
            } else if (el.year === "2018") {
                vis.displayData[2].count += disorder;
            } else {
                vis.displayData[3].count += disorder;
            }
        })

        vis.displayData.forEach(el => {
            el.count = Math.round((el.count / totalCount[el.year]) * 100);
        })

        console.log(vis.displayData)
        this.updateVis();
    }

    updateVis() {
        let vis = this;
        vis.x.domain(d3.extent(vis.displayData, d => vis.parseYear(d.year)))

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip-line")
            .style("opacity", 0)
            .style("position", "absolute");


        let line = d3.line()
            .x(d => vis.x(vis.parseYear(d.year)))
            .y(d => vis.y(parseFloat(d.count)));


        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("fill", "none")
            .style("stroke", "red")
            .style("stroke-width", "2")
            .attr("d", line);

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
            .text("% of people who have disorders");

        vis.svg.selectAll(".dot")
            .data(vis.displayData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => vis.x(vis.parseYear(d.year)))
            .attr("cy", d => vis.y(parseFloat(d.count)))
            .attr("r", 5)
            .attr("fill", "red")
            .on('mouseover', function (event, d) {
                tooltip.transition()
                    .delay(30)
                    .duration(200)
                    .style("opacity", 1);

                tooltip.html(
                        `
                <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px;">
                    <h6> Percent with mental health disorder: ${d.count}%</h6>                   
                </div>`
                    )
                    .style("left", (event.pageX + 25) + "px")
                    .style("top", (event.pageY) + "px");

                const selection = d3.select(this).raise();

                selection
                    .transition()
                    .delay("20")
                    .duration("200")
                    .attr("r", 10)
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);

                const selection = d3.select(this);

                selection
                    .transition()
                    .delay("20")
                    .duration("200")
                    .attr("r", 5)
            });;

        let curtain = vis.svg.append('rect')
            .attr('x', -1 * vis.width - 5)
            .attr('y', -1 * vis.height)
            .attr('height', vis.height)
            .attr('width', vis.width)
            .attr('class', 'curtain')
            .attr('transform', 'rotate(180)')
            .style('fill', '#2c2c2c')

        document.addEventListener('aos:in:double-aos', ({ detail }) => {
            let t = vis.svg.transition()
            .delay(750)
            .duration(6000)
            .ease(d3.easeLinear);

            t.select('rect.curtain')
                .attr('width', 0);
        });
       

    }
}