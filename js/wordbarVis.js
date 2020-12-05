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
            bottom: 20,
            left: 70
        };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.y = d3.scaleBand()
            .rangeRound([ vis.height, 0])
            .paddingInner(0.1);

        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

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

        // Get Selected Category from appropriate Div
        vis.selectedCategory = $('#wordSelector').val();

        // Filter by selected
        vis.filteredData = vis.surveyData.filter(function(d) {
            return d.type == vis.selectedCategory;
        });

        // Get a words list
        vis.wordslist = vis.filteredData.map(function(d, i) {
            return {index: i, text: d.word, size: +d.freq};
        })

        // Filter according to desired number of words
        vis.displayData = vis.wordslist.filter(function(d) {
            return d.index < 10;
        });

        vis.displayData = vis.displayData.sort(function(x, y){
            return d3.ascending(x.size, y.size);
        })

        // change SPECIALSTRINGS global for word stories
        SPECIALSTRINGS = vis.displayData.map(d => d.text)

        this.updateVis();
    }

    updateVis(input) {

        let vis = this;

        // Set x axes
        vis.x.domain([0, d3.max(vis.displayData, d => d.size)]);
        vis.y.domain(vis.displayData.map(d => d.text));

        // enter, update, exit bars
        let bars = vis.svg.selectAll(".rect-disorders")
            .data(vis.displayData);

        bars.enter().append("rect")
            .on("mouseover", onMouseOver) //Add listener for the mouseover event
            .on("mouseout", onMouseOut)   //Add listener for the mouseout event;
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("class", "rect-disorders")
            .attr("x", 0)
            .attr("y", d => vis.y(d.text))
            .attr("width", d => vis.x(d.size))
            .attr("height", vis.y.bandwidth())
            .attr("fill", "#8be9fd")


        bars.exit().remove();

        // Draw Axes
        vis.svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(vis.xAxis);

        vis.svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(vis.yAxis);
    }

}