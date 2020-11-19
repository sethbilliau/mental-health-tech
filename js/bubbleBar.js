class BubbleBar {
    constructor(parentElement, surveyData) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;
        this.filteredData = surveyData;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = $("#" + vis.parentElement).height()  - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.filter = "gender";
        vis.subfilter = "M";


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
        console.log(vis.surveyData)
        vis.filteredData = {
            "anxiety": 0,
            "mood": 0,
            "psychotic": 0,
            "eating": 0,
            "adhd": 0,
            "personality": 0,
            "ocd": 0,
            "ptsd": 0,
            "stress_response_syndromes": 0,
            "dissociative": 0,
            "substance_use": 0,
            "addictive": 0,
            "other_disorder": 0
        };
        let keys = Object.keys(vis.filteredData);

        if (vis.subfilter === "M" || vis.subfilter === "F" || vis.subfilter === "Other-Gender") {
            vis.filter = "gender";
        } else if (vis.subfilter === "18-25" || vis.subfilter === "26-35" || vis.subfilter === "36-50" || vis.subfilter === "51-75") {
            vis.filter = "age";
        } else if (vis.subfilter === "White" || vis.subfilter === "Asian" || vis.subfilter === "Hispanic-Black" || vis.subfilter === "Other-Race") {
            vis.filter = "race";
        }


        vis.surveyData.forEach(el => {   
            if (vis.subfilter === "M" || vis.subfilter === "F" || vis.subfilter === "White" || vis.subfilter === "Asian") {
                if (el[vis.filter] === vis.subfilter) {
                    for (const key of keys) {
                        vis.filteredData[key] += parseInt(el[key]);
                    }
                }
            } else if (vis.subfilter === "dev" || vis.subfilter === "mgmt" || vis.subfilter === "other_job" || vis.subfilter === "support" || vis.subfilter === "designer") {
                if (parseInt(el[vis.subfilter]) === 1) {
                    for (const key of keys) {
                        vis.filteredData[key] += parseInt(el[key]);
                    }
                }
            } else if (vis.subfilter === "Hispanic-Black") {
                if (el["race"] === "Hispanic" || el["race"] === "Black or African American") {
                    for (const key of keys) {
                        vis.filteredData[key] += parseInt(el[key]);
                    }
                }
            } else if (vis.subfilter === "Other-Race") {
                if (el["race"] !== "White" && el["race"] !== "Asian" && el["race"] !== "Hispanic" && el["race"] !== "Black or African American" && el["race"] !== "NA") {
                    for (const key of keys) {
                        vis.filteredData[key] += parseInt(el[key]);
                    }
                }
            } else if (vis.subfilter === "Other-Gender") {
                if (el["gender"] !== "M" && el["gender"] !== "F" && el["gender"] !== "NA") {
                    for (const key of keys) {
                        vis.filteredData[key] += parseInt(el[key]);
                    }
                }   
            }  else if (vis.subfilter === "18-26" || vis.subfilter === "26-35" || vis.subfilter === "36-50" || vis.subfilter === "51-75") {
                if (parseInt(el[vis.filter]) >= parseInt(vis.subfilter.substring(0, 2)) && parseInt(el[vis.filter]) <= parseInt(vis.subfilter.substring(3))) {
                    for (const key of keys) {
                        vis.filteredData[key] += parseInt(el[key]);
                    }
                }
            }
        })
        
        vis.displayData = []
        for (const key of keys) {
            if (Number.isNaN(vis.filteredData[key])) {
                delete vis.filteredData[key];
            } else {
                vis.displayData.push({
                    name: key,
                    count: vis.filteredData[key]
                })
            }
        }


        vis.displayData.sort((a, b) => b.count - a.count);

        console.log(vis.displayData)
        this.updateVis();
    }

    updateVis() {
        let vis = this;
        vis.x.domain(vis.displayData.map(d => d.name));
        vis.y.domain([0, d3.max(vis.displayData, d => d.count)]);

        let bars = vis.svg.selectAll(".rect-disorders")
            .data(vis.displayData);

        bars.enter().append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("class", "rect-disorders")
            .attr("x", d => vis.x(d.name))
            .attr("y", d => vis.y(d.count))
            .attr("width", vis.x.bandwidth())
            .attr("height", d => vis.height - vis.y(d.count))
            .attr("fill", "blue");

        bars.exit().remove();

        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }

    onBubbleHovered(key) {
        let vis = this;
        console.log(key);
        vis.subfilter = key;
        vis.wrangleData();
    }
}