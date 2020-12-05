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
                text: "Have you been diagnosed with a mental health disorder?"
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


        let font_size = '12px'
        //Question 1 Label
        let q1_xpos = vis.width / 30
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q1_xpos)
        //     .attr('y', -30)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text($('#sankeySelector1').val())
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q1_xpos)
        //     .attr('y', -20)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('well does the tech industry')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label1')
        //     .attr('x', q1_xpos)
        //     .attr('y', -10)
        //     .attr('text-anchor', 'middle')
        //     .attr('fill', 'white')
        //     .style('font-size', font_size)
        //     .text($('#sankeySelector1').val())

        //Question 2 Label
        // let q2_xpos = vis.width / 3.8

        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q2_xpos)
        //     .attr('y', -30)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('Has your employer')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q2_xpos)
        //     .attr('y', -20)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('ever formally')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q2_xpos)
        //     .attr('y', -10)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('discussed MH?')

        //Question 3 Label
        // let q3_xpos = vis.width / 2;

        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q3_xpos)
        //     .attr('y', -30)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('Does your employer offer resources')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q3_xpos)
        //     .attr('y', -20)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('to learn more about MH and')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q3_xpos)
        //     .attr('y', -10)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('options for seeking help?')

        //Question 4 Label
        // let q4_xpos = vis.width / 1.35;

        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q4_xpos)
        //     .attr('y', -30)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('Have you ever witnessed')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q4_xpos)
        //     .attr('y', -20)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('a badly handled response')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q4_xpos)
        //     .attr('y', -10)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('to a MH issue at work?')

        //Question 5 Label
        let q5_xpos = vis.width / 1.06
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q5_xpos)
        //     .attr('y', -35)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('Would you feel')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q5_xpos)
        //     .attr('y', -25)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('comfortable discussing')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label')
        //     .attr('x', q5_xpos)
        //     .attr('y', -15)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text('an MH issue')
        // vis.svg.append('text')
        //     .attr('class', 'sankey_label2')
        //     .attr('x', q5_xpos)
        //     .attr('y', -10)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', font_size)
        //     .text($('#sankeySelector2').val())

        //)

        vis.phases = [{
                category1: "scale_tech_industry_supports",
                category2: "badly_handled_MH",
                highlightedLinks: ["#link-1", "#link-2", "#link-3"],
                text: "text 1"
            },
            {
                category1: "employer_formally_discussed",
                category2: "comfortable_discussing_coworkers",
                highlightedLinks: ["#link-4", "#link-5", "#link-6"],
                text: "text 2"
            }
        ]

        vis.currPhase = -1;
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
            selectedCategory1 = vis.phases[vis.currPhase].category1;
            selectedCategory2 = vis.phases[vis.currPhase].category2;
            d3.select('#sankeySelector1').property('value', selectedCategory1);
            d3.select('#sankeySelector2').property('value', selectedCategory2);
        } else {
            selectedCategory1 = $('#sankeySelector1').val();
            selectedCategory2 = $('#sankeySelector2').val();
        }
        console.log(selectedCategory1, selectedCategory2)

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

        console.log(vis.data)

        console.log(nodes);

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
        console.log(vis.displayData)
        // if (firstTime) {
        //     vis.updateVis();
        // } else {
        //     vis.updateSankey();
        // }
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
        var units = "Widgets";
        var formatNumber = d3.format(",.0f"), // zero decimal places
            format = function (d) {
                return formatNumber(d) + " " + units;
            };
        // color = d3.scaleOrdinal(d3.schemeCategory10)
        let colorLeft = d3.scaleOrdinal(['#ECECEC', '#84C3EB', '#58ABE1', '#0F83CD', '#06639F'])
        let colorRight = d3.scaleOrdinal(['#ECECEC', '#FBCFA2', '#F9AE6B', '#F78D3D', '#E6550D'])


        // let optionLabel1;
        // let optionLabel2;

        // vis.options.forEach(el => {
        //     if (el.value === $('#sankeySelector1').val()) {
        //         optionLabel1 = el.text;
        //     } else if (el.value === $('#sankeySelector2').val()) {
        //         optionLabel2 = el.text;
        //     }
        // })

        // d3.select(".sankey_label1").text(optionLabel1);
        // d3.select(".sankey_label2").text(optionLabel2);

        vis.sankey
            .nodes(vis.displayData.nodes)
            .links(vis.displayData.links)
            .layout(0);


        // let nodes = vis.svg.append("g").attr("class", "nodes");

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

        // newNode.call(d3.drag()
        //     .subject(function (d) {
        //         return d;
        //     })
        //     .on("start", function () {
        //         this.parentNode.appendChild(this);
        //     })
        //     .on("drag", dragmove));

        // node.transition().duration(1000)
        // .attr("transform", function (d) {
        //     return "translate(" + d.x + "," + d.y + ")";
        // })

        // node = newNode.merge(node);

        newNode.append("rect");
        newNode.append("text");
        // add the rectangles for the nodes
        newNode.select("rect")
            .attr("height", function (d) {
                return d.dy;
            })
            .attr("width", vis.sankey.nodeWidth())
            .style("fill", function (d) {
                console.log(d)
                if (d.targetLinks.length === 0) {
                    return d.color = colorLeft(d.name);
                } else {
                    return d.color = colorRight(d.name);
                }
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })
        // .append("title")
        // .text(function (d) {
        //     return d.name + "\n" + format(d.value);
        // });

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
                console.log('d from gradient stroke func', d);

                // make unique gradient ids  
                let gradientID = `gradient${i}`;

                let startColor = d.source.color;
                let stopColor = d.target.color;

                if (startColor !== stopColor) {
                    console.log('startColor', startColor);
                    console.log('stopColor', stopColor);

                    const linearGradient = vis.defs.append('linearGradient')
                        .attr('id', gradientID);

                    let newGradient = linearGradient.selectAll('stop')
                        .data([{
                                offset: '10%',
                                color: startColor
                            },
                            {
                                offset: '90%',
                                color: stopColor
                            }
                        ]);

                    newGradient
                        .enter().append('stop')
                        .merge(newGradient)
                        .attr('offset', d => {
                            console.log('d.offset', d.offset);
                            return d.offset;
                        })
                        .attr('stop-color', d => {
                            console.log('d.color', d.color);
                            return d.color;
                        });

                    newGradient.exit().remove();

                    return `url(#${gradientID})`;
                } else {
                    return d.source.color;
                }

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

                const selection = d3.select(this).raise();

            })
            .on("mouseout", function (d) {
                vis.tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
            });

        // .sort(function (a, b) {
        //     return b.dy - a.dy;
        // });

        // add the link titles
        // newLink.append("title")
        //     .text(function (d) {
        //         return d.source.name + " → " +
        //             d.target.name + "\n" + format(d.value);
        //     });

        // link = newLink.merge(link);

        // newLink.transition().duration(1000)
        //     .attr("d", vis.path)
        //     .style("stroke-width", function (d) {
        //         return Math.max(1, d.dy);
        //     });


        link.exit().remove();


        function highlight_node_links(node, highlighted) {
            console.log(node)

            var remainingNodes = [],
                nextNodes = [];

            let stroke_opacity;

            if (highlighted) {
                stroke_opacity = .8;
            } else {
                stroke_opacity = .2;
            }
            // var stroke_opacity = 0;
            // if( d3.select(this).attr("data-clicked") == "1" ){
            //   d3.select(this).attr("data-clicked","0");
            //   stroke_opacity = 0.2;
            // }else{
            //   d3.select(this).attr("data-clicked","1");
            //   stroke_opacity = 0.5;
            // }

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
            console.log(id)
            d3.select("#link-" + id).style("stroke-opacity", opacity);
        }

        vis.svg.selectAll(".link")
            


        // node.select("rect")
        // .style("fill", function (d) {
        //     return d.color = color(d.name.replace(/ .*/, ""));
        // })
        // .style("stroke", function (d) {
        //     return d3.rgb(d.color).darker(2);
        // })
        // .transition().duration(1000)
        // .attr("height", function (d) {
        //     return d.dy;
        // })

        // add in the title for the nodes
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



        // node.select("text")
        // .text(function (d) {
        //     return d.name;
        // })
        // .attr("x", -6)

        // .attr("y", function (d) {
        //     return d.dy / 2;
        // })
        // .attr("text-anchor", "end")
        // .filter(function (d) {
        //     return d.x < vis.width / 2;
        // })
        // .attr("x", 6 + vis.sankey.nodeWidth())
        // .attr("text-anchor", "start");

        node.exit().remove();

        // the function for moving the nodes
        // function dragmove(event, d) {
        //     d3.select(this)
        //         .attr("transform",
        //             "translate(" +
        //             d.x + "," +
        //             (d.y = Math.max(
        //                 0, Math.min(vis.height - d.dy, event.y))) + ")");
        //     vis.sankey.relayout();
        //     link.attr("d", vis.path);
        // }
        if (vis.currPhase >= 0) {
            d3.selectAll(".link").style("stroke-opacity", .3);
            vis.phases[vis.currPhase].highlightedLinks.forEach(el => {
                d3.select(el).style("stroke-opacity", .8);
            })
        }

    }
}