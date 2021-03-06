class BubbleBar {
    constructor(parentElement, surveyData) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;
        this.filteredData = surveyData;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {
            top: 50,
            right: 30,
            bottom: 20,
            left: 170
        };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        let translate = {
            "anxiety": "Anxiety Disorders",
            "mood": "Mood Disorders",
            "psychotic": "Psychotic Disorders",
            "eating": "Eating Disorders",
            "adhd": "ADHD",
            "personality": "Pesonality Disorders",
            "ocd": "OCD",
            "ptsd": "PTSD",
            "stress_response_syndromes": "Stress Response Syndromes",
            "dissociative": "Dissociative Disorders",
            "substance_use": "Substance Use Disorder",
            "addictive": "Addictive Disorders",
            "other_disorder": "Other Disorders"
        };

        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleBand()
            .rangeRound([vis.height, 0])
            .paddingInner(0.1);

        vis.xAxis = d3.axisTop()
            .scale(vis.x)
            .ticks(6);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d => translate[d]);

        let xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis");

        let yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.colorScale = {
            "Total": 'lightblue',
            "M": '#fff9c4',
            "F": 'lightblue',
            "Other-Gender": '#B19CD9',
            "18-25": '#fff9c4',
            "26-35": 'lightblue',
            "36-50": '#B19CD9',
            "51-75": '#8bc34a',
            "White": '#fff9c4',
            "Asian": 'lightblue',
            "Hispanic-Black": '#B19CD9',
            "Other-Race": '#8bc34a',
            "dev": '#fff9c4',
            "mgmt": 'lightblue',
            "other_job": '#B19CD9',
            "support": '#8bc34a',
            "designer": "#ffb86c"
        };

        vis.step = {
            "Total": 0,
            "M": 1,
            "F": 1,
            "Other-Gender": 1,
            "18-25": 2,
            "26-35": 2,
            "36-50": 2,
            "51-75": 2,
            "White": 3,
            "Asian": 3,
            "Hispanic-Black": 3,
            "Other-Race": 3,
            "dev": 4,
            "mgmt": 4,
            "other_job": 4,
            "support": 4,
            "designer": 4
        }

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

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
            } else if (vis.subfilter === "18-25" || vis.subfilter === "26-35" || vis.subfilter === "36-50" || vis.subfilter === "51-75") {
                if (parseInt(el[vis.filter]) >= parseInt(vis.subfilter.substring(0, 2)) && parseInt(el[vis.filter]) <= parseInt(vis.subfilter.substring(3))) {
                    for (const key of keys) {
                        vis.filteredData[key] += parseInt(el[key]);
                    }
                }
            } else {
                for (const key of keys) {
                    vis.filteredData[key] += parseInt(el[key]);
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


        vis.displayData.sort((a, b) => a.count - b.count);

        this.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.y.domain(vis.displayData.map(d => d.name));
        vis.x.domain([0, d3.max(vis.displayData, d => d.count)]);

        let bars = vis.svg.selectAll(".rect-disorders")
            .data(vis.displayData);

        bars.enter().append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("class", "rect-disorders")
            .attr("x", 0)
            .attr("y", d => vis.y(d.name))
            .attr("width", d => vis.x(d.count))
            .attr("height", vis.y.bandwidth())
            .attr("fill", vis.colorScale[vis.subfilter]);

        bars.exit().remove();

        let label_data = vis.svg.selectAll('.rect-disorders-labels')
            .data(vis.displayData);

        label_data.enter().append('text')
            .attr('class', 'rect-disorders-labels')
            .style('font-size', '15px')
            .merge(label_data)
            .transition().duration(1000)
            .attr('x', d => vis.x(d.count) + 5)
            .attr('y', d => vis.y(d.name) + 20)
            .attr('fill', '#fafafa')
            .style('font-weight', 'bold')
            .text(d => {
                return d.count;
            });

        label_data.exit().remove();


        vis.svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(vis.xAxis)

        vis.svg.select(".x-axis")
            .append("text")
            .attr("x", 100)
            .attr("y", -30)
            .text("# of people diagnosed with disorder");

        vis.svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(vis.yAxis);
    }

    onBubbleHovered(key) {
        let vis = this;
        vis.subfilter = key;
        $(`#step${vis.step[key]+1}`).html('<div id="bubble-bar"></div>');
        vis.initVis();
    }
}