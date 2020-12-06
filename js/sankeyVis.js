/* sankey about work culture */
class SankeyVis {


    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = {};

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {
            top: 45,
            right: 20,
            bottom: 20,
            left: 100
        };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .size([vis.width, vis.height]);

        vis.path = vis.sankey.link();
        vis.defs = vis.svg.append('defs');

        vis.links = vis.svg.append("g");
        vis.nodes = vis.svg.append("g");

        vis.options = [{
                value: "disorder",
                text: "Are you struggling with a mental health issue?"
            },
            {
                value: "scale_tech_industry_supports",
                text: "How well does the tech industry support mental health?"
            },
            {
                value: "employer_formally_discussed",
                text: "Has your employer ever formally discussed mental health?"
            },
            {
                value: "employer_offers_resources",
                text: "Does your employer offer resources to learn more about MH and options for seeking help?"
            },
            {
                value: "badly_handled_MH",
                text: "Have you ever witnessed a badly handled response to a MH issue at work?"
            },
            {
                value: "comfortable_discussing_coworkers",
                text: "Would you feel comfortable discussing an MH issue with your coworkers?"
            }
        ]

        d3.select("#sankeySelector1")
            .selectAll("myOptions1")
            .data(vis.options)
            .enter().append('option')
            .text(d => d.text)
            .attr("value", d => d.value);

        d3.select("#sankeySelector2")
            .selectAll("myOptions2")
            .data(vis.options)
            .enter().append('option')
            .text(d => d.text)
            .attr("value", d => d.value);

        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip-sankey")
            .style("opacity", 0)
            .style("position", "absolute");


        vis.phases = [{
                category1: "disorder",
                category2: "employer_offers_resources",
                highlightedLinks: ["#link-0", "#link-3"],
                text: "<h5 style = 'font-size: 18px !important;'>When asked <cyan-bold>whether their employer offered resources for mental health:</cyan-bold><br><br><orange-bold>42%</orange-bold> of people <orange-bold>without </orange-bold>mental health issues answered 'Yes'.<br><br><lime-bold>Only 36%</lime-bold> of people <lime-bold>with</lime-bold> mental health issues answered 'Yes'.<br></h5> "
            },
            {
                category1: "disorder",
                category2: "comfortable_discussing_coworkers",
                highlightedLinks: ["#link-0", "#link-3"],
                text: "<h5 style = 'font-size: 18px !important;'>When asked <cyan-bold>whether they feel comfortable discussing mental health issues with coworkers:</cyan-bold><br><br><orange-bold>36%</orange-bold> of people <orange-bold>without </orange-bold>mental health issues answered 'Yes'.<br><br><lime-bold>Only 27%</lime-bold> of people <lime-bold>with</lime-bold> mental health issues answered 'Yes'.<br></h5>"
            },
            {
                category1: "employer_formally_discussed",
                category2: "comfortable_discussing_coworkers",
                highlightedLinks: ["#link-0", "#link-3"],
                text: "<h5 style = 'font-size: 18px !important;'>When asked whether <cyan-bold>they feel comfortable discussing mental health with coworkers:</cyan-bold><br><br><orange-bold>43%</orange-bold> of people whose employers <orange-bold>did formally discuss mental health</orange-bold> answered 'Yes'.<br><br><lime-bold>Only 28%</lime-bold> of people whose employers <lime-bold>did NOT formally discuss mental health</lime-bold> answered 'Yes'.</h5>"
            },
            {
                text: "<h5 style = 'font-size: 18px !important;'>Use the dropdown menus above the sankey diagram to choose which survey responses to view.</h5>"
            }
        ]

        vis.currPhase = 0;
        vis.wrangleData();

    }

    wrangleData(phase = 0) {
        let vis = this;
        let nodes = [];
        let links = [];


        let response_list = {
            "disorder": ["Yes", "No"],
            "scale_tech_industry_supports": [1, 2, 3, 4, 5],
            "employer_formally_discussed": ['Yes', 'No'],
            "employer_offers_resources": ['Yes', 'No', "I don't know"],
            "badly_handled_MH": ["Yes, I experienced", "Yes, I observed", "No", "Maybe/Not sure"],
            "comfortable_discussing_coworkers": ["Yes", "Maybe", "No"]
        }

        let selectedCategory1;
        let selectedCategory2;

        if (phase != 0) {
            vis.currPhase += phase;
        }

        if (vis.currPhase == 0) {
            $("#prevButton").prop("disabled", true);
        } else {
            $("#prevButton").prop("disabled", false);
        }

        if (vis.currPhase == 3) {
            $("#nextButton").prop("disabled", true);
        } else {
            $("#nextButton").prop("disabled", false);
        }

        if (vis.currPhase < 3) {
            selectedCategory1 = vis.phases[vis.currPhase].category1;
            selectedCategory2 = vis.phases[vis.currPhase].category2;
            d3.select('#sankeySelector1').property('value', selectedCategory1);
            d3.select('#sankeySelector2').property('value', selectedCategory2);
        } else {
            selectedCategory1 = $('#sankeySelector1').val();
            selectedCategory2 = $('#sankeySelector2').val();
        }

        let counter = 0;
        let index_list1 = [];
        let index_list2 = [];
        response_list[selectedCategory1].forEach(el => {
            nodes.push({
                'name': String(el),
                'node': counter
            })
            index_list1.push(counter);
            counter += 1;
        });

        response_list[selectedCategory2].forEach(el => {
            nodes.push({
                'name': String(el),
                'node': counter
            })
            index_list2.push(counter);
            counter += 1;
        })

        response_list[selectedCategory1].forEach((el, ind) => {
            response_list[selectedCategory2].forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (el3[selectedCategory1] == el && el3[selectedCategory2] == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': index_list1[ind],
                    'target': index_list2[ind2],
                    'value': count
                })
            })
        })


        vis.displayData['nodes'] = nodes
        vis.displayData['links'] = links

        vis.updateVis();
    }

    updateSankey() {
        let vis = this;

        vis.sankey
            .nodes(vis.displayData.nodes)
            .links(vis.displayData.links)
            .layout(0);

        // vis.sankey.relayout();

        vis.svg.selectAll(".link")
            .data(vis.displayData.links)
            .transition()
            .duration(1000)
            .attr("d", vis.path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })

        vis.svg.selectAll(".node")
            .data(vis.displayData.nodes, function (d) {
                return d.name;
            })
            .transition()
            .duration(1000)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        vis.svg.selectAll(".node rect")
            .transition()
            .duration(1000)
            .attr("height", function (d) {
                return d.dy;
            });

        vis.svg.selectAll(".node text")
            .transition()
            .duration(1000)
            .attr("y", function (d) {
                return d.dy / 2;
            });
    }

    updateVis() {
        let vis = this;

        let colorLeft = d3.scaleOrdinal(['#ECECEC', '#84C3EB', '#58ABE1', '#0F83CD', '#06639F'])
        let colorRight = d3.scaleOrdinal(['#ECECEC', '#D1B3F2', '#BD91EB', '#AC6EED', '#9752E0'])


        vis.sankey
            .nodes(vis.displayData.nodes)
            .links(vis.displayData.links)
            .layout(0);


        // add in the nodes
        let node = vis.nodes.selectAll(".node")
            .data(vis.displayData.nodes, d => d.name);

        let newNode = node
            .enter().append("g")
            .attr("class", "node")
            .merge(node);

        newNode.on("mouseover", (event, d) => highlight_node_links(d, true))
            .on("mouseout", (event, d) => highlight_node_links(d, false))


        newNode.transition().duration(1000)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })

        newNode.append("rect");
        newNode.append("text");

        newNode.select("rect")
            .attr("height", function (d) {
                return d.dy;
            })
            .attr("width", vis.sankey.nodeWidth())
            .style("fill", function (d) {
                if (d.targetLinks.length === 0) {
                    return d.color = colorLeft(d.name);
                } else {
                    return d.color = colorRight(d.name);
                }
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })

        let link = vis.links.selectAll(".link")
            .data(vis.displayData.links);

        let newLink = link
            .enter().append("path")
            .attr("class", "link")
            .merge(link);

        newLink
            .transition().duration(1000)
            .attr("d", vis.path);

        newLink
            .attr("id", function (d, i) {
                d.id = i;
                return "link-" + i;
            })
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })
            .style('stroke', (d, i) => {
                return d.source.color;
            })
            .style('opacity', function (d) {
                if (d.value === 0) {
                    return 0;
                }
            });

        newLink.on('mouseover', function (event, d) {
                vis.tooltip.transition()
                    .delay(30)
                    .duration(200)
                    .style("opacity", 1);

                vis.tooltip.html(
                        `
                <div style="border: thin solid grey; border-radius: 5px; background: #555555; padding: 10px">
                    <h6> Respondents: ${d.value}</h6>                     
                </div>`
                    )
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY) + "px");

            })
            .on("mouseout", function (d) {
                vis.tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
            });


        link.exit().remove();


        function highlight_node_links(node, highlighted) {
            var remainingNodes = [],
                nextNodes = [];

            let stroke_opacity;

            if (highlighted) {
                stroke_opacity = .8;
            } else {
                stroke_opacity = .2;
            }

            var traverse = [{
                linkType: "sourceLinks",
                nodeType: "target"
            }, {
                linkType: "targetLinks",
                nodeType: "source"
            }];

            traverse.forEach(function (step) {
                node[step.linkType].forEach(function (link) {
                    remainingNodes.push(link[step.nodeType]);
                    highlight_link(link.id, stroke_opacity);
                });

                while (remainingNodes.length) {
                    nextNodes = [];
                    remainingNodes.forEach(function (node) {
                        node[step.linkType].forEach(function (link) {
                            nextNodes.push(link[step.nodeType]);
                            highlight_link(link.id, stroke_opacity);
                        });
                    });
                    remainingNodes = nextNodes;
                }
            });
        }

        function highlight_link(id, opacity) {
            d3.select("#link-" + id).style("stroke-opacity", opacity);
        }

        newNode.select("text")
            .attr("x", -6)
            .attr("y", function (d) {
                return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) {
                return d.name;
            })
            .style("fill", "white")
            .filter(function (d) {
                return d.x < vis.width / 2;
            })
            .attr("x", 6 + vis.sankey.nodeWidth())
            .attr("text-anchor", "start");

        node.exit().remove();


        if (vis.currPhase == 3) {
            d3.selectAll(".link").style("stroke-opacity", .3);
            $("#sankey-text").html(vis.phases[vis.currPhase].text);
        }

        if (vis.currPhase < 3) {
            $("#sankey-text").html(vis.phases[vis.currPhase].text);
            vis.phases[vis.currPhase].highlightedLinks.forEach(el => {
                d3.select(el).transition().duration(1000)
                    .attr("d", vis.path)
                    .style("stroke-opacity", .8).style("stroke", "#ff5555");
            })

            d3.selectAll(".link").style("stroke-opacity", .3);
            d3.selectAll(".link").style("stroke", d => d.source.color);
        }

    }
}