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



        vis.colorScale = ['orange', 'lightblue', '#B19CD9'];

        vis.step = false;
        d3.select("#button-step").on("click", function (d) {
            vis.step = !vis.step;
            if (!vis.step) {
                d3.selectAll(`circle`).style('fill', function(d) {
                    if (d.disorder) {
                        return 'red';
                    } else {
                        return 'orange';
                    }
                })
            } else {
                d3.selectAll('circle')
                .style('fill', function(d) {
                    if (d.disorder) {
                        return 'red';
                    } else {
                        return vis.colorScale[d.category];
                    } 
                })
            }
            vis.updateVis();
        })



        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.nodes = []

        // vis.surveyData.forEach((el, i) => {
        //     nodes.append({
                
        //     })
        // })

        let numMale = Math.round(vis.surveyData.reduce(function (n, person) {
            return n + (person.gender === "M");
        }, 0) / 10);

        let numFemale = Math.round(vis.surveyData.reduce(function (n, person) {
            return n + (person.gender === "F");
        }, 0) / 10);

        let numOther = Math.round(vis.surveyData.reduce(function (n, person) {
            return n + (person.gender !== "M" && person.gender !== "F");
        }, 0) / 10);

        let numMaleDisorder = Math.floor(vis.surveyData.reduce(function (n, person) {
            return n + (person.disorder === "Yes" && person.gender === "M");
        }, 0) / 10);

        let numFemaleDisorder = Math.floor(vis.surveyData.reduce(function (n, person) {
            return n + (person.disorder === "Yes" && person.gender === "F");
        }, 0) / 10);

        let numOtherDisorder = Math.floor(vis.surveyData.reduce(function (n, person) {
            return n + (person.disorder === "Yes" && person.gender !== "M" && person.gender !== "F");
        }, 0) / 10);

        console.log(numMale, numFemale, numOther)
        console.log(numMaleDisorder, numFemaleDisorder, numOtherDisorder)
        var numNodes = 100
        let maleNode = d3.range(numMale).map(function (d, i) {
            return {
                category: 0,
                disorder: i < 74
            }
        });

        let femaleNode = d3.range(numFemale).map(function (d, i) {
            return {
                category: 1,
                disorder: i < 44
            }
        });

        let otherNode = d3.range(numOther).map(function (d, i) {
            return {
                category: 2,
                disorder: i < 5
            }
        });

        vis.nodes = maleNode.concat(femaleNode, otherNode);
        console.log(vis.nodes)
        vis.xCenter = [2 * vis.width / 10, 6 * vis.width / 10, 9 * vis.width / 10];
        vis.yCenter = vis.height / 2;


        this.updateVis();
    }

    updateVis() {
        let vis = this;


        var simulation = d3.forceSimulation(vis.nodes)
            .force('charge', d3.forceManyBody().strength(-2))
            .force('x', d3.forceX().x(function (d) {
                return vis.step ? vis.xCenter[d.category] : vis.width / 2;
            }))
            .force('y', d3.forceY().y(function (d) {
                return vis.yCenter;
            }))
            .force('collision', d3.forceCollide().radius(function (d) {
                return 8;
            }))
            .on('tick', ticked);

        function ticked() {
            let circles = vis.svg.selectAll('circle')
                .data(vis.nodes);

            circles.enter()
                .append('circle')
                .attr('r', 6)
                .merge(circles)
                .attr('class', d => `circle-${d.category}`)
                .attr('fill', function(d) {
                    if (d.disorder) {
                        return 'red';
                    } else {
                        if (vis.step) {
                            return vis.colorScale[d.category];
                        } else {
                            return 'orange';
                        }
                    }
                })
                .attr('cx', function (d) {
                    return d.x;
                })
                .attr('cy', function (d) {
                    return d.y;
                });

            circles.on('mouseover', highlight)
                .on('mouseout', dehighlight);

            function highlight(e, d) {
                let categories = [0, 1, 2].filter(el => el != d.category);

                for (const category of categories) {
                    d3.selectAll(`.circle-${category}`)
                        .style('fill', 'grey')
                        .style('opacity', .3)
                }
            }

            function dehighlight(e, d) {
                let categories = [0, 1, 2].filter(el => el != d.category);

                for (const category of categories) {
                    d3.selectAll(`.circle-${category}`).style('fill', function(d) {
                        if (d.disorder) {
                            return 'red';
                        } else {
                            return vis.colorScale[d.category]
                        }
                    })
                        .style('opacity', 1);
                }
            }
            circles.exit().remove();
        }
    }
}