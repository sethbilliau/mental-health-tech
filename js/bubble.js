class BubbleChart {
    constructor(parentElement, surveyData) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;
        console.log(surveyData)
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {
            top: 50,
            right: 50,
            bottom: 50,
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

        vis.colorScale = {
            "M": 'orange',
            "F": 'lightblue',
            "Other-Gender": '#B19CD9',
            "18-25": 'orange',
            "26-35": 'lightblue',
            "36-50": '#B19CD9',
            "51-75": 'green',
            "White": 'orange',
            "Asian": 'lightblue',
            "Hispanic-Black": '#B19CD9',
            "Other-Race": 'green'
        };
        vis.stepNames = ["start", "gender", "age", "race", "occupation"];
        vis.step = 0;

        d3.select("#next-step").on("click", function (d) {
            vis.step += 1;
            d3.selectAll(`.circle-bubble`)
                .style('fill', d => vis.updateColors(d))

            vis.updateVis();
        })

        d3.select("#prev-step").on("click", function (d) {
            vis.step -= 1;
            d3.selectAll(`.circle-bubble`)
                .style('fill', d => vis.updateColors(d))
            vis.updateVis();
        })

        vis.xCenter = {
            "M": 2 * vis.width / 10,
            "F": 6 * vis.width / 10,
            "Other-Gender": 9 * vis.width / 10,
            "18-25": 2 * vis.width / 10,
            "26-35": 8 * vis.width / 10,
            "36-50": 2 * vis.width / 10,
            "51-75": 8 * vis.width / 10,
            "White": 2 * vis.width / 10,
            "Asian": 8 * vis.width / 10,
            "Hispanic-Black": 2 * vis.width / 10,
            "Other-Race": 8 * vis.width / 10

        };
        vis.yCenter = {
            "M": vis.height / 2,
            "F": vis.height / 2,
            "Other-Gender": vis.height / 2,
            "18-25": 2 * vis.height / 5,
            "26-35": 2 * vis.height / 5,
            "36-50": 4 * vis.height / 5,
            "51-75": 4 * vis.height / 5,
            "White": 2 * vis.height / 5,
            "Asian": 2 * vis.height / 5,
            "Hispanic-Black": 4 * vis.height / 5,
            "Other-Race": 4 * vis.height / 5
        }

        this.wrangleData();
    }

    updateColors(d) {
        let vis = this;
        if (vis.stepNames[vis.step] === "start") {
            if (d["gender"][1]) {
                return "red";
            } else {
                return "orange"
            }
        } else if (vis.stepNames[vis.step] === "race" || vis.stepNames[vis.step] === "occupation") {
            if (!d[vis.stepNames[vis.step]]) {
                return "none";
            } else if (d[vis.stepNames[vis.step]][1]) {
                return "red";
            } else {
                return vis.colorScale[d[vis.stepNames[vis.step]][0]];
            }
        } else {
            if (d[vis.stepNames[vis.step]][1]) {
                return "red";
            } else {
                return vis.colorScale[d[vis.stepNames[vis.step]][0]];
            }
        }
    }

    wrangleData() {
        let vis = this;

        vis.nodes = []
        let counts = {
            "gender": {
                "M": {
                    total: 0,
                    numDisorder: 0,
                },
                "F": {
                    total: 0,
                    numDisorder: 0,
                },
                "Other-Gender": {
                    total: 0,
                    numDisorder: 0,
                },
            },
            "age": {
                "18-25": {
                    total: 0,
                    numDisorder: 0,
                },
                "26-35": {
                    total: 0,
                    numDisorder: 0
                },
                "36-50": {
                    total: 0,
                    numDisorder: 0,
                },
                "51-75": {
                    total: 0,
                    numDisorder: 0,
                }
            },
            "race": {
                "White": {
                    total: 0,
                    numDisorder: 0,
                },
                "Asian": {
                    total: 0,
                    numDisorder: 0
                },
                "Hispanic-Black": {
                    total: 0,
                    numDisorder: 0
                },
                "Other-Race": {
                    total: 0,
                    numDisorder: 0
                }
            },

        }

        vis.surveyData.forEach((el, i) => {
            let disorder = true ? el.disorder === "Yes" : false;
            if (counts["gender"][el.gender]) {
                counts["gender"][el.gender].total += 1;
                counts["gender"][el.gender].numDisorder += disorder;
            } else {
                counts["gender"]["Other-Gender"].total += 1;
                counts["gender"]["Other-Gender"].numDisorder += disorder;
            }
            if (counts["race"][el.race]) {
                counts["race"][el.race].total += 1;
                counts["race"][el.race].numDisorder += disorder;
            } else if (el.race === "Hispanic" || el.race === "Black or African American") {
                counts["race"]["Hispanic-Black"].total += 1;
                counts["race"]["Hispanic-Black"].numDisorder += disorder;
            } else if (el.race === "More than one of the above") {
                counts["race"]["Other-Race"].total += 1;
                counts["race"]["Other-Race"].numDisorder += disorder;
            }


            if (el.age >= 18 && el.age <= 25) {
                counts["age"]["18-25"].total += 1;
                counts["age"]["18-25"].numDisorder += disorder;
            } else if (el.age >= 26 && el.age <= 35) {
                counts["age"]["26-35"].total += 1;
                counts["age"]["26-35"].numDisorder += disorder;
            } else if (el.age >= 36 && el.age <= 50) {
                counts["age"]["36-50"].total += 1;
                counts["age"]["36-50"].numDisorder += disorder;
            } else {
                counts["age"]["51-75"].total += 1;
                counts["age"]["51-75"].numDisorder += disorder;
            }
        })

        let categoryKeys = Object.keys(counts);
        for (const key of categoryKeys) {
            let subcateogryKeys = Object.keys(counts[key]);
            for (const subkey of subcateogryKeys) {
                if (subkey === "Hispanic-Black") {
                    counts[key][subkey].total = Math.ceil(counts[key][subkey].total / 10) + 1
                    counts[key][subkey].numDisorder = Math.ceil(counts[key][subkey].numDisorder / 10);
                } else {
                    counts[key][subkey].total = Math.round(counts[key][subkey].total / 10)
                    counts[key][subkey].numDisorder = Math.round(counts[key][subkey].numDisorder / 10);
                }
            }
        }
        console.log(counts)

        vis.nodes = d3.range(296).map(function (d, i) {
            return {

            }
        });

        let copyCounts = {
            ...counts
        };
        vis.nodes.forEach(el => {
            for (const key of categoryKeys) {
                let subcateogryKeys = Object.keys(copyCounts[key]);
                for (const subkey of subcateogryKeys) {
                    if (copyCounts[key][subkey].total > 0) {
                        let hasDisorder = false;
                        if (copyCounts[key][subkey].numDisorder > 0) {
                            hasDisorder = true;
                            copyCounts[key][subkey].numDisorder--;
                        }
                        el[key] = [subkey, hasDisorder];
                        copyCounts[key][subkey].total--;
                        break;
                    }
                }
            }
        })

        console.log(vis.nodes)

        this.updateVis();
    }

    updateVis() {
        let vis = this;


        var simulation = d3.forceSimulation(vis.nodes)
            .force('charge', d3.forceManyBody().strength(-2))
            .force('x', d3.forceX().x(function (d) {
                if (vis.stepNames[vis.step] === "race" || vis.stepNames[vis.step] === "occupation") {
                    if (!d[vis.stepNames[vis.step]]) {
                        return 0;
                    } else {
                        return vis.xCenter[d[vis.stepNames[vis.step]][0]];
                    }
                } else {
                    return vis.stepNames[vis.step] !== "start" ? vis.xCenter[d[vis.stepNames[vis.step]][0]] : vis.width / 2;
                }
            }))
            .force('y', d3.forceY().y(function (d) {
                if (vis.stepNames[vis.step] === "race" || vis.stepNames[vis.step] === "occupation") {
                    if (!d[vis.stepNames[vis.step]]) {
                        return 0;
                    } else {
                        return vis.yCenter[d[vis.stepNames[vis.step]][0]];
                    }
                } else {
                    return vis.stepNames[vis.step] !== "start" ? vis.yCenter[d[vis.stepNames[vis.step]][0]] : vis.width / 2;
                }
            }))
            .force('collision', d3.forceCollide().radius(function (d) {
                return 8;
            }))
            .on('tick', ticked);

        function ticked() {
            let circles = vis.svg.selectAll('.circle-bubble')
                .data(vis.nodes);

            circles.enter()
                .append('circle')
                .attr('r', 6)
                .merge(circles)
                .attr('class', function (d) {
                    let className = `circle-bubble circle-${d["age"][0]} circle-${d["gender"][0]}`;
                    if (d["race"]) {
                        className += ` circle-${d["race"][0]}`;
                    }
                    return className;
                })
                .attr('fill', d => vis.updateColors(d))
                .attr('cx', function (d) {
                    return d.x;
                })
                .attr('cy', function (d) {
                    return d.y;
                });

            circles.on('mouseover', highlight)
                .on('mouseout', dehighlight);

            let groups = {
                "gender": ["M", "F", "Other-Gender"],
                "age": ["18-25", "26-35", "36-50", "51-75"],
                "race": ["White", "Asian", "Hispanic-Black", "Other-Racef"]
            }

            function highlight(e, d) {
                let categories = groups[vis.stepNames[vis.step]].filter(el => el != d[vis.stepNames[vis.step]][0]);

                for (const category of categories) {
                    d3.selectAll(`.circle-${category}`)
                        .style('fill', 'grey')
                        .style('opacity', .3)
                }
            }

            function dehighlight(e, d) {
                let categories = groups[vis.stepNames[vis.step]].filter(el => el != d[vis.stepNames[vis.step]][0]);

                for (const category of categories) {
                    d3.selectAll(`.circle-${category}`).style('fill', function (d) {
                            if (d[vis.stepNames[vis.step]][1]) {
                                return 'red';
                            } else {
                                return vis.colorScale[d[vis.stepNames[vis.step]][0]]
                            }
                        })
                        .style('opacity', 1);
                }
            }
            circles.exit().remove();
        }
    }
}