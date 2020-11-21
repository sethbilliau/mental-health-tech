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
            top: 30,
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

        vis.svg.append('text')
            .attr('id', 'sankey_tech_q')
            .attr('x', 0)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Out of 5 (best), how well does the tech industry support MH?')

        vis.svg.append('text')
            .attr('id', 'sankey_formal_q')
            .attr('x', vis.width/3)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Has your employer ever formally discussed MH?')

        vis.svg.append('text')
            .attr('id', 'sankey_resources_q1')
            .attr('x', vis.width/2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Does your employer offer resources to learn')
        vis.svg.append('text')
            .attr('id', 'sankey_resources_q2')
            .attr('x', vis.width/2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('more about MH and options for seeking help?')

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        let nodes;
        console.log(vis.data)
        nodes = [{
                'name': '1',
                'node': 0
            },
            {
                'name': '2',
                'node': 1
            },
            {
                'name': '3',
                'node': 2
            },
            {
                'name': '4',
                'node': 3
            },
            {
                'name': '5',
                'node': 4
            },
            {
                'name': 'Yes',
                'node': 5
            },
            {
                'name': 'No',
                'node': 6
            },
            {
                'name': 'Yes',
                'node': 7
            },
            {
                'name': 'No',
                'node': 8
            },
            {
                'name': "I don't know",
                'node': 9
            },
            {
                'name': 'Yes, I experienced',
                'node': 10
            },
            {
                'name': 'Yes, I observed',
                'node': 11
            },
            {
                'name': 'No',
                'node': 12
            },
            {
                'name': "Maybe/Not sure",
                'node': 13
            },
            {
                'name': 'Yes',
                'node': 14
            },
            {
                'name': 'No',
                'node': 15
            },
            {
                'name': 'Maybe',
                'node': 16
            }
        ]

        console.log(nodes);

        let tech_list = [1, 2, 3, 4, 5]
        let formal_list = ['Yes', 'No'];
        let resources_list = ['Yes', 'No', "I don't know"];
        let handled_list = ["Yes, I experienced", "Yes, I observed", "No", "Maybe/Not sure"];
        let comfortable_list = ["Yes", "Maybe", "No"];

        let tech_index = [0,1,2,3,4]
        let formal_index = [5,6];
        let resources_index = [7,8,9];
        let handled_index = [10,11,12,13];
        let comfortable_index = [14,15,16];

        let links = []

        tech_list.forEach((el, ind) => {
            formal_list.forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (parseInt(el3["scale_tech_industry_supports"]) === el && el3["employer_formally_discussed"] == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': tech_index[ind],
                    'target': formal_index[ind2],
                    'value': count
                })
            })
        })

        formal_list.forEach((el, ind) => {
            resources_list.forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (el3["employer_formally_discussed"] === el && el3["employer_offers_resources"] == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': formal_index[ind],
                    'target': resources_index[ind2],
                    'value': count
                })
            })
        })

        resources_list.forEach((el, ind) => {
            handled_list.forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (el3["employer_offers_resources"] === el && el3["badly_handled_MH"] == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': resources_index[ind],
                    'target': handled_index[ind2],
                    'value': count
                })
            })
        })

        handled_list.forEach((el, ind) => {
            comfortable_list.forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (el3["badly_handled_MH"] === el && el3["comfortable_discussing_coworkers"] == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': handled_index[ind],
                    'target': comfortable_index[ind2],
                    'value': count
                })
            })
        })

        vis.displayData['nodes'] = nodes
        vis.displayData['links'] = links
        console.log(vis.displayData)
        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        var units = "Widgets";
        var formatNumber = d3.format(",.0f"), // zero decimal places
            format = function (d) {
                return formatNumber(d) + " " + units;
            },
            color = d3.scaleOrdinal(d3.schemeCategory10)

        var sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .size([vis.width, vis.height]);

        var path = sankey.link();

        let myData = vis.displayData;

        sankey
            .nodes(myData.nodes)
            .links(myData.links)
            .layout(32);
        console.log(myData.links);

        var link = vis.svg.append("g").selectAll(".link")
            .data(myData.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })
            // .sort(function (a, b) {
            //     return b.dy - a.dy;
            // });

        // add the link titles
        link.append("title")
            .text(function (d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + format(d.value);
            });

        // add in the nodes
        var node = vis.svg.append("g").selectAll(".node")
            .data(myData.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.drag()
                .subject(function (d) {
                    return d;
                })
                .on("start", function () {
                    this.parentNode.appendChild(this);
                })
                .on("drag", dragmove));

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) {
                return d.dy;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })
            .append("title")
            .text(function (d) {
                return d.name + "\n" + format(d.value);
            });

        // add in the title for the nodes
        node.append("text")
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
            .filter(function (d) {
                return d.x < vis.width / 2;
            })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(event, d) {
            d3.select(this)
                .attr("transform",
                    "translate(" +
                    d.x + "," +
                    (d.y = Math.max(
                        0, Math.min(vis.height - d.dy, event.y))) + ")");
            sankey.relayout();
            link.attr("d", path);
        }

    }
}