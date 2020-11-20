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
            top: 20,
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


        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        let nodes;
        console.log(vis.data)
        nodes = [{
                'name': 'Has MH disorder',
                'node': 0
            },
            {
                'name': 'No MH disorder',
                'node': 1
            },
            {
                'name': '0',
                'node': 2
            },
            {
                'name': '1',
                'node': 3
            },
            {
                'name': '2',
                'node': 4
            },
            {
                'name': '3',
                'node': 5
            },
            {
                'name': '4',
                'node': 6
            },
            {
                'name': '5',
                'node': 7
            },
            {
                'name': '6',
                'node': 8
            },
            {
                'name': '7',
                'node': 9
            },
            {
                'name': '8',
                'node': 10
            },
            {
                'name': '9',
                'node': 11
            },
            {
                'name': '10',
                'node': 12
            },
            {
                'name': 'Very difficult',
                'node': 13
            },
            {
                'name': 'Somewhat difficult',
                'node': 14
            },
            {
                'name': 'Neither easy or difficult',
                'node': 15
            },
            {
                'name': 'Somewhat easy',
                'node': 16
            },
            {
                'name': 'Very easy',
                'node': 17
            },
            {
                'name': 'Yes',
                'node': 18
            },
            {
                'name': 'Maybe',
                'node': 19
            },
            {
                'name': 'No',
                'node': 20
            },
            {
                'name': 'Yes',
                'node': 21
            },
            {
                'name': 'Maybe',
                'node': 22
            },
            {
                'name': 'No',
                'node': 23
            }
        ]

        console.log(nodes);
        // let disorder_list = ['has_disorder', 'no_disorder']
        // let scale_list = ['scale_0', 'scale_1', 'scale_2', 'scale_3', 'scale_4', 'scale_5', 'scale_6', 'scale_7', 'scale_8', 'scale_9', 'scale_10'];
        // let leave_list = ['v_difficult', 'somewhat_diff', 'neither', 'somewhat_easy', 'v_easy'];
        // let comfort_list = ['comfortable_yes', 'comfortable_maybe', 'comfortable_no'];
        // let observe_list = ['observe_yes', 'observe_maybe', 'observe_no'];

        // let translate = {
        //     'has_disorder': 0,
        //     'no_disorder': 1,
        //     'scale_0': 2,
        //     'scale_1': 3,
        //     'scale_2': 4,
        //     'scale_3': 5,
        //     'scale_4': 6,
        //     'scale_5': 7,
        //     'scale_6': 8,
        //     'scale_7': 9,
        //     'scale_8': 10,
        //     'scale_9': 11,
        //     'scale_10': 12,
        //     'v_difficult': 13,
        //     'somewhat_diff': 14,
        //     'neither': 15,
        //     'somewhat_easy': 16,
        //     'v_easy': 17,
        //     'comfortable_yes': 18,
        //     'comfortable_maybe': 19,
        //     'comfortable_no': 20,
        //     'observe_yes': 21,
        //     'observe_maybe': 22,
        //     'observe_no': 23
        // };

        let disorder_list = [0, 1]
        let scale_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let leave_list = ["Very difficult", "Somewhat difficult", "Neither easy nor difficult", "Somewhat easy", "Very easy"];
        let comfort_list = ["Yes", "Maybe", "No"];
        let observe_list = ["Yes", "Maybe", "No"];

        let disorder_index = [0, 1]
        let scale_index = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let leave_index = [13, 14, 15, 16, 17];
        let comfort_index = [18, 19, 20];
        let observe_index = [21, 22, 23];

        let links = []

        disorder_list.forEach((el, ind) => {
            scale_list.forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (parseInt(el3["has_disorder"]) === el && parseInt(el3["scale_employer_MH"]) == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': disorder_index[ind],
                    'target': scale_index[ind2],
                    'value': count
                })
            })
        })

        scale_list.forEach((el, ind) => {
            leave_list.forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (parseInt(el3["scale_employer_MH"]) === el && el3["easy_medical_leave"] == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': scale_index[ind],
                    'target': leave_index[ind2],
                    'value': count
                })
            })
        })

        leave_list.forEach((el, ind) => {
            comfort_list.forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (el3["easy_medical_leave"] === el && el3["comfortable_discussing_coworkers"] == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': leave_index[ind],
                    'target': comfort_index[ind2],
                    'value': count
                })
            })
        })

        comfort_list.forEach((el, ind) => {
            observe_list.forEach((el2, ind2) => {
                let count = 0;
                vis.data.forEach(el3 => {
                    if (el3["comfortable_discussing_coworkers"] === el && el3["observe_coworker_likelihood"] == el2) {
                        count += 1;
                    }
                })
                links.push({
                    'source': comfort_index[ind],
                    'target': observe_index[ind2],
                    'value': count
                })
            })
        })
        // disorder_list.forEach(v1 => {
        //     let v1_condition = 0
        //     if (v1 == 'has_disorder') {
        //         v1_condition = 1;
        //     }
        //     scale_list.forEach(v2 => {
        //         let count = 0
        //         let v2_condition = v2.substring(6)
        //         v2_condition = parseInt(v2_condition);
        //         vis.data.forEach(d => {
        //             if (d.has_disorder == v1_condition && d.scale_employer_MH == v2_condition) {
        //                 count = count + 1;
        //             }
        //         })
        //         links.push({
        //             'source': translate[v1],
        //             'target': translate[v2],
        //             'value': count
        //         })
        //         leave_list.forEach(v3 => {
        //             let count = 0
        //             let v3_condition;
        //             // console.log(nodes);
        //             nodes.forEach(d => {
        //                 // console.log(d);
        //                 if (v3 == d.node) {
        //                     v3_condition = d.name;
        //                 }
        //             })
        //             vis.data.forEach(d => {
        //                 if (d.scale_employer_MH == v2_condition && d.easy_medical_leave == v3_condition) {
        //                     count = count + 1;
        //                 }
        //             })
        //             links.push({
        //                 'source': translate[v2],
        //                 'target': translate[v3],
        //                 'value': count
        //             })
        //             comfort_list.forEach(v4 => {
        //                 let count = 0
        //                 let v4_condition;
        //                 nodes.forEach(d => {
        //                     if (v4 == d.node) {
        //                         v4_condition = d.name;
        //                     }
        //                 })
        //                 vis.data.forEach(d => {
        //                     if (d.easy_medical_leave == v3_condition && d.comfortable_discussing_coworkers == v4_condition) {
        //                         count = count + 1;
        //                     }
        //                 })
        //                 links.push({
        //                     'source': translate[v3],
        //                     'target': translate[v4],
        //                     'value': count
        //                 });
        //                 observe_list.forEach(v5 => {
        //                     let count = 0
        //                     let v5_condition;
        //                     nodes.forEach(d => {
        //                         if (v5 == d.node) {
        //                             v5_condition = d.name;
        //                         }
        //                     })
        //                     vis.data.forEach(d => {
        //                         if (d.comfortable_discussing_coworkers == v4_condition && d.observe_coworker_likelihood == v5_condition) {
        //                             count = count + 1;
        //                         }
        //                     })
        //                     links.push({
        //                         'source': translate[v4],
        //                         'target': translate[v5],
        //                         'value': count
        //                     });
        //                 })
        //             })
        //         })
        //     })
        // })

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
            color = d3.scaleOrdinal(d3.schemeCategory10);

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


        var link = vis.svg.append("g").selectAll(".link")
            .data(myData.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })
            .sort(function (a, b) {
                return b.dy - a.dy;
            });

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