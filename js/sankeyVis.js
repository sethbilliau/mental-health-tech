/* sankey about work culture */


class SankeyVis {


    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

        this.displayData = {};

        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 100};

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = $("#" + vis.parentElement).height()  - vis.margin.top - vis.margin.bottom;

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

        vis.path = vis.sankey.links();

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;
        let nodes;
        console.log(vis.data)
        nodes =[
            {'name': 'Has MH disorder', 'node': 'has_disorder'},
            {'name': 'No MH disorder', 'node': 'no_disorder'},
            {'name': '0', 'node': 'scale_0'},
            {'name': '1', 'node': 'scale_1'},
            {'name': '2', 'node': 'scale_2'},
            {'name': '3', 'node': 'scale_3'},
            {'name': '4', 'node': 'scale_4'},
            {'name': '5', 'node': 'scale_5'},
            {'name': '6', 'node': 'scale_6'},
            {'name': '7', 'node': 'scale_7'},
            {'name': '8', 'node': 'scale_8'},
            {'name': '9', 'node': 'scale_9'},
            {'name': '10', 'node': 'scale_10'},
            {'name': 'Very difficult', 'node': 'v_difficult'},
            {'name': 'Somewhat difficult', 'node':'somewhat_diff'},
            {'name': 'Neither easy or difficult', 'node': 'neither'},
            {'name': 'Somewhat easy', 'node':'somewhat_easy'},
            {'name': 'Very easy', 'node': 'v_easy'},
            {'name': 'Yes', 'node': 'comfortable_yes'},
            {'name':'Maybe', 'node': 'comfortable_maybe'},
            {'name': 'No', 'node':'comfortable_no'},
            {'name': 'Yes', 'node':'observe_yes'},
            {'name': 'Maybe', 'node': 'observe_maybe'},
            {'name': 'No', 'node': 'observe_no'}
        ]

        console.log(nodes);
        let disorder_list = ['has_disorder', 'no_disorder']
        let scale_list = ['scale_0', 'scale_1', 'scale_2', 'scale_3', 'scale_4', 'scale_5', 'scale_6', 'scale_7', 'scale_8', 'scale_9', 'scale_10'];
        let leave_list = ['v_difficult', 'somewhat_diff', 'neither', 'somewhat_easy', 'v_easy'];
        let comfort_list = ['comfortable_yes', 'comfortable_maybe', 'comfortable_no'];
        let observe_list = ['observe_yes', 'observe_maybe', 'observe_no'];

        let links = []

        disorder_list.forEach(v1 =>{
            let v1_condition = 0
            if (v1 == 'has_disorder'){
                v1_condition = 1;
            }
            scale_list.forEach(v2 =>{
                let count = 0
                let v2_condition = v2.substring(6)
                v2_condition = parseInt(v2_condition);
                vis.data.forEach(d => {
                    if (d.has_disorder == v1_condition && d.scale_employer_MH == v2_condition){
                        count = count +1;
                    }
                })
                links.push({'source': v1, 'target': v2, 'value': count})
                leave_list.forEach(v3 => {
                    let count = 0
                    let v3_condition;
                    // console.log(nodes);
                    nodes.forEach(d =>{
                        // console.log(d);
                        if (v3 == d.node){
                            v3_condition = d.name;
                        }
                    })
                    vis.data.forEach(d => {
                        if (d.scale_employer_MH == v2_condition && d.easy_medical_leave == v3_condition){
                            count = count +1;
                        }
                    })
                    links.push({'source': v2, 'target': v3, 'value': count})
                    comfort_list.forEach(v4 => {
                        let count = 0
                        let v4_condition;
                        nodes.forEach(d =>{
                            if (v4 == d.node){
                                v4_condition = d.name;
                            }
                        })
                        vis.data.forEach(d => {
                            if (d.easy_medical_leave == v3_condition && d.comfortable_discussing_coworkers == v4_condition){
                                count = count +1;
                            }
                        })
                        links.push({'source': v3, 'target': v4, 'value': count});
                        observe_list.forEach(v5 => {
                            let count = 0
                            let v5_condition;
                            nodes.forEach(d =>{
                                if (v5 == d.node){
                                    v5_condition = d.name;
                                }
                            })
                            vis.data.forEach(d => {
                                if (d.comfortable_discussing_coworkers == v4_condition && d.observe_coworker_likelihood == v5_condition){
                                    count = count +1;
                                }
                            })
                            links.push({'source': v4, 'target': v5, 'value': count});
                        })
                    })
                })
            })
        })

        vis.displayData['nodes'] = nodes
        vis.displayData['links'] = links
        console.log(vis.displayData)
        vis.updateVis();
    }

    updateVis(){
        let vis = this;

        // vis.sankey
        //     .nodes(vis.displayData.nodes)
        //     .links(vis.displayData.links)
            // .layout(32);

        vis.link = vis.svg.append('g').selectAll('link')
            .data(vis.displayData.links)
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', vis.path)
            .style('stroke-width', d=> Math.max(1,d.dy))
            .sort(function(a,b){
                return b.dy - a.dy;
            });

    }
}