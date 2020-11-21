class WordBar {
    constructor(parentElement, surveyData) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {
            top: 20,
            right: 20,
            bottom: 70,
            left: 40
        };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.1);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        let xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(0,${vis.height})`);

        let yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis");


        this.wrangleData();
    }

    wrangleData() {
        let vis = this;
        // check out the data


        vis.selectedCategory = $('#wordSelector').val();
        // check out the data
        vis.filteredData = vis.surveyData.filter(function(d) {
            return d.type == vis.selectedCategory;
        });


        vis.wordslist = vis.filteredData.map(function(d, i) {
            return {index: i, text: d.word, size: +d.freq};
        })

        vis.displayData = vis.wordslist.filter(function(d) {
            return d.index < 10;
        });

        this.updateVis();
    }

    updateVis() {
        let vis = this;
        vis.x.domain(vis.displayData.map(d => d.text));
        vis.y.domain([0, d3.max(vis.displayData, d => d.size)]);

        let bars = vis.svg.selectAll(".rect-disorders")
            .data(vis.displayData);

        bars.enter().append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("class", "rect-disorders")
            .attr("x", d => vis.x(d.text))
            .attr("y", d => vis.y(d.size))
            .attr("width", vis.x.bandwidth())
            .attr("height", d => vis.height - vis.y(d.size))
            .attr("fill", "cornflowerblue");

        bars.exit().remove();

        vis.svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(vis.xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 2)
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        vis.svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(vis.yAxis);
    }

}